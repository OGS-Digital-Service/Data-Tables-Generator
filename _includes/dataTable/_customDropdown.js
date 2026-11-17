(function ($) {
    $(document).ready(function () {
        let dropdownsInitialized = false;

        new DataTable('#{{params.tableName}}', {
            columnDefs: [{
                orderable: true,
                targets: [0, 1, 2, 3, 4, 5, 6],
                render: function (data, type) {
                    if (type !== 'display' && typeof data === 'string') {
                        return data.replace(/<.*?>/g, '');
                    }
                    return data;
                }
            }],
            layout: {
                topStart: {
                    search: {
                        placeholder: '{{params.searchPlaceholder}}'
                    }
                },
                topEnd: 'info',
                bottomStart: null,
                bottomEnd: null,
                bottom: 'paging'
            },
            order: [[0, 'asc']],
            responsive: true,

            drawCallback: function () {
                if (dropdownsInitialized) return;

                const api = this.api();
                const layoutRow = $(api.table().container())
                    .find('.dt-layout-row')
                    .first();

                if (!layoutRow.length) return;

                const customFilters = $('<div class="custom-filters"></div>');

                initDropdown('agency_filter', 2, api, 'Agency', customFilters);
                initDropdown('type_filter', 4, api, 'Type of Action', customFilters);
                initDropdown('category_filter', 6, api, 'Category', customFilters);

                $('<button type="button" class="nysds-reset-button">Reset</button>')
                    .appendTo(customFilters)
                    .on('click', function () {
                        customFilters.find('select').val('');

                        api.search('');
                        [2, 4, 6].forEach(function (columnIndex) {
                            api.column(columnIndex).search('');
                        });

                        api.draw();
                    });

                // Add the wrapper to the row; don't move or empty the row.
                layoutRow.after(customFilters);
                dropdownsInitialized = true;
            }
        });

        function initDropdown(id, columnIndex, api, labelText, parent) {
            const container = $('<div></div>').appendTo(parent);

            $('<label></label>')
                .attr('for', id)
                .text(labelText + ':')
                .appendTo(container);

            const select = $('<select class="custom-select"></select>')
                .attr('id', id)
                .append('<option value=""></option>')
                .appendTo(container)
                .on('change', function () {
                    const value = $.fn.dataTable.util.escapeRegex($(this).val());

                    api.column(columnIndex)
                        .search(value ? '^' + value + '$' : '', true, false)
                        .draw();
                });

            api.column(columnIndex)
                .data()
                .unique()
                .sort()
                .each(function (value) {
                    select.append(
                        $('<option></option>').val(value).text(value)
                    );
                });
        }
    });
})(jQuery);
