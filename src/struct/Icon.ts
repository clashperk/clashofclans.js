/**
 * Represents a Icon
 */
export class Icon {
	public url: string;
	public tiny: string;
	public small: string;
	public medium: string;

	public constructor(data: any) {
		/**
		 * The default icon URL
		 * @type {string}
		 */
		this.url = data.medium;

		/**
		 * The medium icon URL
		 * @type {string}
		 */
		this.medium = data.medium;

		/**
		 * The small icon URL
		 * @type {string}
		 */
		this.small = data.small;

		/**
		 * The tiny icon URL
		 * @type {string}
		 */
		this.tiny = data.tiny ?? data.small;
	}
}
