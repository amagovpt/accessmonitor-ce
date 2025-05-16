export function highlightElmnt(code: string): boolean {
    const element = document.querySelector(code);
    if (element) {
        const style = element.getAttribute('style');
        if (style?.includes('border: 2px solid red;')) { // unhighlight element
            const newStyle = style.replace('border: 2px solid red;', 'border: none;');
            element.setAttribute('style', newStyle);
            return false;
        } else { // highlight element
            if (style) {
                if (style.includes('border: none;')) {
                    const newStyle = style.replace('border: none;', 'border: 2px solid red;');
                    element.setAttribute('style', newStyle);
                } else {
                    const newStyle = style.concat(' border: 2px solid red;');
                    element.setAttribute('style', newStyle);
                }
            } else {
                element.setAttribute('style', 'border: 2px solid red;');
            }
            return true;
        }
    }
    return false;
}

export function highlightAllElmnts(codes: string[]): boolean {
    if (!codes || codes.length == 0) {
        return false;
    }

    codes.map((code) => {
        const element = document.querySelector(code);
        if (element) {
            const style = element.getAttribute("style");
            if (style) {
                if (style.includes('border: none;')) {
                    const newStyle = style.replace('border: none;', 'border: 2px solid red;');
                    element.setAttribute('style', newStyle);
                } else {
                    const newStyle = style.concat(' border: 2px solid red;');
                    element.setAttribute('style', newStyle);
                }
            } else {
                element.setAttribute('style', 'border: 2px solid red;');
            }
        }
    });
    return true;
}

export function unhighlightAllElmnts(codes: string[]): boolean {
    if (!codes || codes.length == 0) {
        return false;
    }

    codes.map((code) => {
        const element = document.querySelector(code);
        if (element) {
            const style = element.getAttribute('style');
            if (style?.includes('border: 2px solid red;')) {
                const newStyle = style.replace('border: 2px solid red;', 'border: none;');
                element.setAttribute('style', newStyle);
            }
        }
    });
    return true;
}