module.exports = function ContentForbiddenError (message) {
    this.name = 'ContentForbiddenError';
    this.message = message || 'Este recurso não pertence ao usuário';
};
