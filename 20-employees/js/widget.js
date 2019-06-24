(($) => {
    $.ajax({
        url: 'data/employees.json',
    }).done((data) => {
        let result = '<ul class="list">';
        $.each(data, (index, employee) => result += ((employee.inoffice) ? '<li class="in">' : '<li class="out">') + employee.name + '</li>');
        result += '</ul>';
        $('#employeeList').html(result);
    });
})(jQuery);


// (($) => {
//     $(document).ready(() => {
//         $.getJSON('employees.json', (data) => {
//             
//         });
//     });
// })(jQuery);
