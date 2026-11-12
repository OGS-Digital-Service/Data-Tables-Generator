(function($) {
    $(document).ready(function() {
        let dropdownsInitialized = false;

        new DataTable('#{{params.tableName}}', {
            columnDefs: [{ 
                orderable: true, 
                targets: [0,1,2,3,4],  // Include the "Remote or In-Person" column here
                render: function(data, type, row, meta) {
                    if (type != 'display') {
                        return data.replace( /<.*?>/g, '' );
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
            drawCallback: function() {
                if (!dropdownsInitialized) {
                    // Initialize the dropdown filter for the "Office" column
                    initDropdown('office_filter', 2, this.api());

                    // Initialize the dropdown filter for the "Age" column
                    initDropdown('age_filter', 3, this.api());

                    // Initialize the dropdown filter for the "Remote or In-Person" column
                    initDropdown('remote_person_filter', 4, this.api());

                    // Initialize the reset button
                    initResetButton(this.api());

                    // Set the flag to true
                    dropdownsInitialized = true;
                }
            }
        });

        // Initialize the dropdown filter function
        function initDropdown(id, columnIndex, api) {
            var select = $('<select class="clearthis width_modifier border border-solid border-black p-2.5 mt-2 md:mt-0" id="' + id + '"><option value=""></option></select>')
                .appendTo( $(".filters") )
                .on('change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );
                    api.column(columnIndex)
                        .search( val ? '^'+val+'$' : '', true, false )
                        .draw();
                });

            // Populate the dropdown with unique values from the specified column
            api.column(columnIndex).data().unique().sort().each(function ( d, j ) {
                select.append('<option value="' + d + '">' + d + '</option>');
            });
        }

        // Initialize the reset button function
        function initResetButton(api) {
            var clearFilter = $(".filters .nysds-reset-button");
            
            if (clearFilter.length == 0) {
                var clearButton = $('<button class="nysds-reset-button" id="clear"> Reset </button>')
                    .appendTo( $(".filters") )
                    .on('click', () => {
                        // Clear search input
                        $(api.table().node()).find('.dataTables_filter input').val('');
                        
                        // Clear dropdowns
                        $('#office_filter').val('');
                        $('#age_filter').val('');
                        $('#remote_person_filter').val('');
                        
                        // Redraw the table
                        api.search('').columns().search('').draw();
                    });
            }
        }

    });
})(jQuery);
