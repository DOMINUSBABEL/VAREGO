class MockPublisher {
    constructor() {
        console.log("Initialising Mock Publisher environment...");
    }
    async publish(filePath, text) {
        console.log(`Mocking publish to platform for file: ${filePath}`);
        return true;
    }
}
module.exports = { MockPublisher };
