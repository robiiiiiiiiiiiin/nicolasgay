import Isotope from 'isotope-layout';

document.addEventListener('DOMContentLoaded', function () {
    const elem = document.querySelector('.isotope-grid');
    const filters = document.querySelectorAll('.isotope-filter');

    if (elem) {
        const iso = new Isotope(elem, {
            // options
            itemSelector: '.isotope-item',
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: '.grid-sizer',
                gutter: '.gutter-sizer'
            },
        });
    }

    filters.forEach(filter => {
        filter.addEventListener('click', function () {
            // Remove 'active' class from all filters except the clicked one
            filters.forEach(f => {
                if (f !== this) {
                    f.classList.remove('active');
                }
            });
            if(filter.classList.contains('active')) {
                if (elem) {
                    const iso = Isotope.data(elem);
                    iso.arrange({ filter: '*' }); // Show all items
                }
            } else {
                const filterValue = this.getAttribute('data-filter');
                if (elem) {
                    const iso = Isotope.data(elem);
                    iso.arrange({ filter: filterValue });
                }
            }
            filter.classList.toggle('active');
        });
    });
});