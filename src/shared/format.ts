// Shared formatting utilities for converting and formatting data.
export function convertBytes(length: number): string {
  if (length < 1024) {
    return length + ' bytes';
  } else if (length < 1024000) {
    return Math.round(length / 1024) + ' KB';
  } else {
    return Math.round(length / 1048576) + ' MB';
  }
}
