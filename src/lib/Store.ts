export class Store {

	private list: any = null;

	public constructor() {
		this.list = new Map();
	}

	public get(key: string) {
		return this.list.get(key);
	}

	public set(key: string, value: any) {
		return this.list.set(key, value);
	}

	public has(key: string) {
		return this.list.has(key);
	}

	public delete(key: string) {
		return this.list.delete(key);
	}

	public clear() {
		return this.list.clear();
	}

	public keys() {
		return Array.from(this.list.keys()) as string[];
	}

	public get size() {
		return this.list.size;
	}

}
