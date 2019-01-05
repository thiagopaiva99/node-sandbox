test('should know the main assertions of the jest', () => {
    let number = null;
    expect(number).toBeNull();

    number = 10;
    expect(number).not.toBeNull();
    expect(number).toBe(10);
});
