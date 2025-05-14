export function highlightElmnt(code: string): boolean {
    const element = document.querySelector(code);
    if (element) {
        const parent = element.parentElement;
        if (parent) {
            if (parent.style.border == "2px solid red") {
                parent.style.border = "none";
                return false;
            } else {
                parent.style.border = "2px solid red";
                return true;
            }
        }
    }
    return false;
}