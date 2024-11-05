function generateRandomString(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

function generateRandomFourDigitNumber() {
    return Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
}

function convertToAntdTree(normalTree, parentKey = '') {
    const result = [];

    Object.entries(normalTree).forEach(([key, value], index) => {
        // Construct the current key based on the parent key and current index
        const currentKey = parentKey ? `${parentKey}-${index}` : `${index}`;
        const node = {
            title: key,
            key: currentKey,
        };

        if (value === null) {
            // It's a file, so it's a leaf node
            node.isLeaf = true;
        } else {
            // It's a folder, so recursively convert children
            node.children = convertToAntdTree(value, currentKey);
        }

        result.push(node);
    });

    return result;
}

export { generateRandomString, generateRandomFourDigitNumber, convertToAntdTree }