function updateFooterYear() {
    var year = new Date().getFullYear();
    var yearNodes = document.querySelectorAll('[data-footer-year]');

    yearNodes.forEach(function (node) {
        node.textContent = year;
    });
}

updateFooterYear();
