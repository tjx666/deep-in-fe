async function test() {
    await new Promise((resolve, reject) => {
        setTimeout(() => resolve());
    });
}
