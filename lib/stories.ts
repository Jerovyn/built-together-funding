/**
 * Operator interview / story cards for the content GTM.
 * Leave empty until field interviews exist — HomeStories / Stories page
 * render nothing when the list is empty (no "coming soon" wallpaper).
 */
export type OperatorStory = {
  id: string;
  /** First name or "Owner" */
  name: string;
  trade: string;
  /** Optional city / region */
  place?: string;
  quote: string;
  /** Public image path under /public or remote URL */
  imageSrc?: string;
  /** Optional video/embed URL for later */
  mediaUrl?: string;
};

export const OPERATOR_STORIES: OperatorStory[] = [];

export function hasOperatorStories(): boolean {
  return OPERATOR_STORIES.length > 0;
}
