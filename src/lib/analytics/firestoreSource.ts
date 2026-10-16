// Reads the page-view documents the tracker writes to Firestore, for /stats.
// Loaded only by the dashboard (dynamic import), so visitors never download
// the Firebase SDK.
//
// Reads are billed per document, so documents are kept in the SDK's
// IndexedDB cache: a load reads the cache first and then asks the server only
// for documents updated (rt) since the newest one it already has.

import { initializeApp, getApps } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	type User
} from "firebase/auth";
import {
	collection,
	getDocs,
	getDocsFromCache,
	initializeFirestore,
	orderBy,
	persistentLocalCache,
	persistentMultipleTabManager,
	query,
	Timestamp,
	where,
	type DocumentData,
	type Firestore,
	type QuerySnapshot
} from "firebase/firestore";
import { firebaseWebConfig } from "$lib/firebaseWebConfig";
import { FIRESTORE_COLLECTION } from "./tracker";
import type { Batch } from "./types";

const APP_NAME = "stats";

const app = getApps().find((a) => a.name === APP_NAME) ?? initializeApp(firebaseWebConfig, APP_NAME);
const auth = getAuth(app);
let db: Firestore | undefined;

function firestore(): Firestore {
	db ??= initializeFirestore(app, {
		localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
	});
	return db;
}

export function watchUser(cb: (u: User | null) => void) {
	return onAuthStateChanged(auth, cb);
}
export const signIn = () => signInWithPopup(auth, new GoogleAuthProvider());
export const signOutUser = () => signOut(auth);

const ms = (v: unknown): number | undefined => (v instanceof Timestamp ? v.toMillis() : undefined);

function toBatch(d: DocumentData): Batch {
	const last = ms(d.rt) ?? d.ts;
	return {
		...(d as Batch),
		events: d.events ?? [],
		// rt0 is set by the page view's first batch; if that one was lost, fall back
		// to the client's start time
		rt: ms(d.rt0) ?? Math.min(d.page?.st ?? last, last),
		rtLast: last
	};
}

const docs = new Map<string, Batch>();
let newest = 0;
let primed = false;

/** Page views updated since `from` (epoch ms). */
export async function loadPageviews(from: number, full = false): Promise<{ batches: Batch[]; now: number }> {
	const col = collection(firestore(), FIRESTORE_COLLECTION);
	const keep = (snap: QuerySnapshot<DocumentData>) => {
		for (const s of snap.docs) {
			const b = toBatch(s.data());
			docs.set(s.id, b);
			newest = Math.max(newest, b.rtLast ?? 0);
		}
	};
	if (full) {
		docs.clear();
		newest = 0;
	} else if (!primed) {
		try {
			keep(await getDocsFromCache(query(col, where("rt", ">=", Timestamp.fromMillis(from)), orderBy("rt"))));
		} catch {
			/* empty or unavailable cache: the server query below fills it */
		}
	}
	primed = true;
	const since = Math.max(from, newest);
	keep(
		await getDocs(
			query(col, where("rt", newest && since === newest ? ">" : ">=", Timestamp.fromMillis(since)), orderBy("rt"))
		)
	);
	const batches = [...docs.values()].filter((b) => (b.rtLast ?? 0) >= from);
	return { batches, now: Date.now() };
}
