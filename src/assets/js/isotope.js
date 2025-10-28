import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';


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
        imagesLoaded(elem).on('progress', function () {
            // Refresh layout after each image loads to prevent a height bug
            iso.layout();
        })
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