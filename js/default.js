var odd = 0;
var total_print_documents = 0;
var total_barcodes_printed = 0;
var qz_array = [];
var finished = true;
var allowedColors = ["GOLD", "LIGHT-GOLD", "DARK-GOLD", "ROSE-GOLD", "COPPER", "RED", "LIGHT-RED", "MAROON", "DARK-MAROON", "GREEN", "BOTTLE-GREEN", "PISTA-GREEN", "MEHENDI-GREEN", "LIGHT-GREEN", "LIGHT-PINK", "PARROT-GREEN", "BLUE", "LIGHT-BLUE", "ROYAL-BLUE", "NAVY-BLUE", "LIRIL", "TOMATO-PINK", "PINK", "PINKISH-MAROON", "ORANGE", "PEACH", "MULTI", "GREY", "PURPLE", "BRINJAL", "WINE", "BLACK", "YELLOW", "MUSTARD", "PINK-MULTI", "RED-MULTI", "BLUE-MULTI", "GREEN-MULTI", "YELLOW-MULTI", "WHITE", "OFF-WHITE", "CREAM", "SILVER", "ANTIC-GOLD", "SKIN", "BROWN", "MAGENTA", "MAROON-MULTI", "BLACK-MULTI", "RAMA-GREEN", "PEACOCK-BLUE", "NEON-MULTI", "FIROZI", "YELLOW-GOLD", "SKY-BLUE", "LIGHT-ORANGE", "DARK-COPPER", "ONION-PINK", "TEAL", "BEIGE", "FUCHSIA", "DARK-PINK", "OLIVE-GREEN", "MINT-GREEN", "LIME-YELLOW", "PASTEL-BLUE", "LIME-GREEN", "PASTEL-GREEN", "DUSTY-BLUE", "DUSTY-PEACH", "DARK-GREEN", "DUSTY-GREEN", "S-PINK", "GERMAN-GREEN", "FIRE-BLUE", "DARK-GREY", "GERMAN-BLUE", "GOLD-MULTI","SILVER-MULTI","BLACK-MULTI","DARK-BRINJAL","T.BLUE","AQUA","Z.GREEN","RANI","LEMON","MUSTARD-GOLD","ORANGE","F.GREEN","N.MAGENTA","N.GOLD","R-PINK","DC-BLUE","SEA-GREEN","DARK-BLUE","DARK-PEACH","GAJARI","VIOLET","BLACK-GOLD","BLACK-SILVER"];
var allowedSizes = ["26", "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "56", "58", "60", "L", "XL", "XXL", "M", "S", "XS", "XXS", "XXXL", "4XL", "28", "FS", "14Y", "6Y", "8Y", "2Y", "4Y", "10Y", "12Y", "NA", "S/M", "L/XL","6-12M","12-18M","18-24M","2-3Y","3-4Y","4-5Y","5-6Y","6-7Y","7-8Y","8-9Y","9-10Y","10-11Y","11-12Y","12-13Y","13-14Y"];
var allowedStates = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Tripura", "Uttaranchal", "Uttar Pradesh", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadar and Nagar Haveli", "Daman and Diu", "Delhi", "Lakshadeep", "Pondicherry"
];
var selectedSubOrders = new Array;
jQuery(function($) {
    /* Initializing Accordion Menu */

    var active_tab = $("#active_tab").val();
    var active_tab1 = active_tab.split("-");
    var currentTab = "tab" + active_tab1[0];
    $("#" + currentTab).addClass("selected");
    $("#" + active_tab).css("background-color", "#3F5E61");
    if ($('.left_accordion').length > 0) {
        $('.left_accordion').navAccordion({
                expandButtonText: '', //Text inside of buttons can be HTML
                collapseButtonText: ''
            },
            function() {
                console.log('Callback')
            });
    }
    /* End of accordion menu initalization */

    $('body').on('keypress', function(e) {
        if (e.which == 13)
            return false;
    });
    $('.input-group input').keydown(function(e) {
        if (e.which == 9) { // tab
            e.preventDefault();
            $(this).parent().find('.dropdown-toggle').click();
            $(this).parent().find('.dropdown-menu a:first').focus();
        }
    });

    /* FOR HORIZONTAL DROPDOWNS NAVIGATION

    $('.dropdown-menu a').keydown(function(e) {
        switch (e.which) {
            case 38: // home
                e.preventDefault();
                $(this).closest('.dropdown-menu').find('a:first').focus();
                break;
            case 40: // end
                e.preventDefault();
                $(this).closest('.dropdown-menu').find('a:last').focus();
                break;
            case 27: // end
                e.preventDefault();
                $(this).parent().find('.dropdown-toggle').click();
                break;
        }
    });
    
    */

    var now = new Date();
    var from = new Date();
    var to = new Date();
    var max = new Date();
    var min = new Date();


    max.setDate(max.getDate() + 1);
    min.setDate(min.getDate() + 90);
    from.setDate(max.getDate() - 7);

    $('.from-datetimepicker').datetimepicker({
        defaultDate: from,
    });
    $('.bill-datetimepicker1').datetimepicker({
        defaultDate: to,
        format: 'DD/MM/YYYY'
    });
    $('.bill-datetimepicker2').datetimepicker({
        defaultDate: to,
        format: 'DD/MM/YYYY'
    });

    $('.to-datetimepicker').datetimepicker({
        defaultDate: to
    });
    $('#billing_date').datetimepicker({
        defaultDate: to,
        maxDate: now
    });
    $('.return-datetimepicker').datetimepicker({
        defaultDate: to,
        minDate: to
    });

    $('#discount_percentage, #against_h_form').change(function() {
        calculateTotal();
    });

    $("body").delegate(".pagination a", "click", function() {
        var page = $(this).data('page');
        if (page == "disabled") {} else if (page == "previous") {
            var current_page = $(".active a").data('page');
            if (typeof current_page == "undefined" || current_page == "" || current_page == 0)
                current_page = 1;
            $(".active").toggleClass("active");
            current_page--;
            organizePagination(total_pages, current_page);
            updateContent();
        } else if (page == "next") {
            var current_page = $(".active a").data('page');
            if (typeof current_page == "undefined" || current_page == "" || current_page == 0)
                current_page = 1;
            $(".active").toggleClass("active");
            current_page++;
            organizePagination(total_pages, current_page);
            updateContent();
        } else {
            $(".active").toggleClass("active");
            $(this).closest("li").toggleClass("active");
            updateContent();
        }
    });


    $('body').delegate('.view_entries_table .options', 'click', function() {
        var id = $(this).closest('tr').data('id');

        if ($(this).attr('data-edit'))
            document.location.href = $('#route_path').val() + '/' + id;
        else
            document.location.href = $('#route_path').val() + '/' + id;
    });


    $(".barcodeScanner").scroll(function() {
        var divend = $(this)[0].scrollHeight //+ $(this).offset().top; // full height of div (from top and actual div height).
        var pagescroll = $(this).scrollTop() + $(this).height(); // Total page scrolled.
        if (divend <= pagescroll) {
            var newId = $('.barcodeScanner table tr:last').data('id') + 1;
            var newRow = '<tr id="element-' + newId + '" data-id="' + newId + '">';
            newRow += '<td>' + newId + '</td>';
            newRow += '<td style="width:150px"><input type="text" class="barcode barcode_field" id="barcode-' + newId + '" autocomplete="off" value=""></td>';
            newRow += '<td class="description"></td>';
            newRow += '<td style="width:150px"><input type="text" class="barcode quantity" id="quantity-' + newId + '" autocomplete="off" value=""></td>';
            newRow += '<td class="mrp"></td>';
            newRow += '<td class="discount_rate"></td>';
            newRow += '<td class="discount"></td>';
            newRow += '<td class="taxable_value"></td>';
            newRow += '<td class="gst_rate"></td>';
            newRow += '<td class="original" style="display:none;"></td>';
            $('.barcodeScanner table').append(newRow);
            // alert(" Div End reached! "+$(this).offset().top);
            //alert("Full DIV height: "+divend+" Scroll page Height: "+pagescroll); 
        }

    });

    $(".barcodeScanner_approval").scroll(function() {
        var divend = $(this)[0].scrollHeight //+ $(this).offset().top; // full height of div (from top and actual div height).
        var pagescroll = $(this).scrollTop() + $(this).height(); // Total page scrolled.
        if (divend <= pagescroll) {
            var newId = $('.barcodeScanner_approval table tr:last').data('id') + 1;
            var newRow = '<tr id="element-' + newId + '" data-id="' + newId + '">';
            newRow += '<td>' + newId + '</td>';
            newRow += '<td style="width:150px"><input type="text" class="barcode barcode_field" id="barcode-' + newId + '" autocomplete="off" value=""></td>';
            newRow += '<td class="design"></td>';
            newRow += '<td class="color"></td>';
            newRow += '<td class="size"></td>';
            newRow += '<td class="mrp"></td>';
            $('.barcodeScanner_approval table').append(newRow);
        }

    });

    $(".orderScanner").scroll(function() {
        var divend = $(this)[0].scrollHeight
        var pagescroll = $(this).scrollTop() + $(this).height();
        if (divend <= pagescroll) {
            var newId = $('.orderScanner table tr:last').data('id') + 1;
            var newRow = '<tr id="element-' + newId + '" data-id="' + newId + '">';
            newRow += '<td>' + newId + '</td>';
            newRow += '<td contenteditable="true" class="design"></td>';
            newRow += '<td contenteditable="true" class="color"></td>';
            newRow += '<td contenteditable="true" class="size"></td>';
            newRow += '<td contenteditable="true" class="quantity"></td>';
            newRow += '<td contenteditable="true" class="note"></td>';
            $('.orderScanner table').append(newRow);
        }
    });

    $(".inwardScanner").scroll(function() {
        var divend = $(this)[0].scrollHeight
        var pagescroll = $(this).scrollTop() + $(this).height();
        if (divend <= pagescroll) {
            var newId = $('.inwardScanner table tr:last').data('id') + 1;
            var newRow = '<tr id="element-' + newId + '" data-id="' + newId + '">';
            newRow += '<td>' + newId + '</td>';
            newRow += '<td contenteditable="true" class="design"></td>';
            newRow += '<td contenteditable="true" class="color"></td>';
            newRow += '<td contenteditable="true" class="size"></td>';
            newRow += '<td contenteditable="true" class="quantity"></td>';
            newRow += '<td contenteditable="true" class="billing_amount"></td>';
            newRow += '<td contenteditable="true" class="total"></td>';
            $('.inwardScanner table').append(newRow);
        }
    });

});



function highlightIfEmpty(element) {
    if (element.text() == "" || element.text() == null) {
        element.focus();
        //element.style("border-color:red")
        return false;
    } else {
        return true;
    }
}

function calculateTotal() {
    var barcode = $("#element-1 .barcode").val();
    var i = 1;
    var sum = parseFloat(0);
    var taxable_value = 0;
    var cgst = 0;
    var sgst = 0;
    var discount = 0;
    var discount_rate = 0;
    var quantity = 0;
    var net = 0;
    var net_sum = 0;
    var discount_sum = 0;
    var sgst_sum = 0;
    var cgst_sum = 0;
    var igst_sum = 0;
    var quantity_sum = 0;
    var bill_sum = 0;
    var bill_amt;
    var gst_type = $("#gst_type").val();
    var type_client = $("#type_client").val();
    var against_h_form = $("#against_h_form").val();
    var transport_charges = $("#transport_charge").val();

    var cgst_2_5 = 0;
    var sgst_2_5 = 0;
    var cgst_6 = 0;
    var sgst_6 = 0;
    var igst_5 = 0;
    var igst_12 = 0;
    var cgst_0_05 = 0;
    var igst_0_1 = 0;

    var round_up = 0;



    while (barcode != "" && barcode != null) {
        mrp = parseFloat($("#element-" + i + " .mrp").data("val")).toFixed(2);
        quantity = parseFloat($("#element-" + i + " .quantity").val()).toFixed(2);
        bill_amt = mrp * quantity;
        discount_rate = $("#discount_percentage").val();
        discount = parseFloat(mrp * discount_rate / 100).toFixed(2);
        discount_amt = discount * quantity;
        var selling_rate = parseFloat(mrp) - parseFloat(discount);
        if (discount < 1)
            discount_rate = parseFloat(0).toFixed(2);
        if (type_client.toLowerCase() == "ethnicity") {
            var retail = parseFloat($("#element-" + i + " .mrp").data("retail")).toFixed(2);
            discount = parseFloat(retail * discount_rate / 100).toFixed(2);
            selling_rate = parseFloat(mrp) - parseFloat(discount);
            discount_amt = discount * quantity;
        }

        taxable_value = parseFloat(bill_amt - discount_amt);
        //alert(taxable_value); alert(selling_rate);
        if (gst_type == "S") {

            if (against_h_form == 1) {
                gst_rate = parseFloat(0.1).toFixed(2);
                cgst_0_05 += taxable_value;
            } else {

                if (selling_rate <= 1000) {
                    gst_rate = parseFloat(5).toFixed(2);
                    cgst_2_5 += taxable_value;
                } else {
                    gst_rate = parseFloat(12).toFixed(2);
                    cgst_6 += taxable_value;
                }

            }


        } else {

            if (against_h_form == 1) {
                gst_rate = parseFloat(0.1).toFixed(2);
                igst_0_1 += taxable_value;
            } else {
                if (selling_rate <= 1000) {
                    gst_rate = parseFloat(5).toFixed(2);
                    igst_5 += taxable_value;
                } else {
                    gst_rate = parseFloat(12).toFixed(2);
                    igst_12 += taxable_value;
                }
            }
        }


        net = total;

        $("#element-" + i + " .mrp").text(mrp);
        $("#element-" + i + " .discount_rate").text(discount_rate);
        $("#element-" + i + " .discount").text(discount_amt);
        $("#element-" + i + " .taxable_value").text(taxable_value.toFixed(2));
        $("#element-" + i + " .gst_rate").text(gst_rate);
        $("#element-" + i + " .quantity").val(quantity);

        quantity_sum = parseFloat(quantity_sum) + parseFloat($("#element-" + i + " .quantity").val());
        bill_sum = bill_sum + parseFloat(bill_amt);


        sum = parseFloat(sum) + parseFloat($("#element-" + i + " .mrp").html());
        discount_sum = parseFloat(discount_sum) + parseFloat($("#element-" + i + " .discount").html());
        i++;
        barcode = $("#element-" + i + " .barcode").val();
    }
    if (cgst_2_5 > 0 || cgst_6 > 0 || cgst_0_05 > 0)
        cgst_sum += parseFloat(+percentage(cgst_2_5, 2.5) + +percentage(cgst_6, 6) + +percentage(cgst_0_05, 0.05));

    sgst_sum = cgst_sum;

    if (igst_5 > 0 || igst_12 > 0 || igst_0_1 > 0) {
        igst_sum = parseFloat(+percentage(igst_5, 5) + +percentage(igst_12, 12) + +percentage(igst_0_1, 0.1));
    }

    //alert(igst_sum);alert(cgst_sum);alert(sgst_sum);
    net_sum = bill_sum - discount_sum + sgst_sum + cgst_sum + igst_sum;
    if (transport_charges)
        net_sum = net_sum + parseFloat(transport_charges);

    var temp_round_up = net_sum.toFixed(0);
    round_up = temp_round_up - net_sum;
    $('#billing_amount').val(bill_sum.toFixed(2));
    $('#quantity').val(quantity_sum.toFixed(2));
    $('#sgst').val(sgst_sum.toFixed(2));
    $('#cgst').val(cgst_sum.toFixed(2));
    $('#igst').val(igst_sum.toFixed(2));
    $('#discount').val(discount_sum.toFixed(2));
    $('#round_up').val(round_up.toFixed(2));
    $('#total').val(net_sum.toFixed(0));
}

function percentage(number, percent) {
    var percentageValue = (number.toFixed(2) * percent * 0.01);
    percentageValue = (Math.round(percentageValue * 100) / 100).toFixed(2);
    return percentageValue;
}


function reinitializeFields() {
    $("#barcodes").val("");
    $("#designs").val("");
    $("#colors").val("");
    $("#sizes").val("");
    $("#billing_amounts").val("");
    $("#taxable_amounts").val("");
    $("#descriptions").val("");
    $("#gst_rates").val("");
    $("#sgst_amounts").val("");
    $("#cgst_amounts").val("");
    $("#igst_amounts").val("");

    $("#discount_amounts").val("");
    $("#totals").val("");

    $("#quantities").val("");
    $("#notes").val("");
    $("#old_barcodes").val("");
    $("#new_barcodes").val("");
    $("#old_skus").val("");
    $("#new_skus").val("");
}


function printBarcodes() {

    if (qz) {
        var config = qz.configs.create("TSC TTP-247")
    } else {
        qz = document.getElementById('qz');
        config = qz.configs.create("TSC TTP-247")
    }

    var date = new Date();
    var date_string = date.getDate() + "." + parseInt(parseInt(date.getMonth()) + 1) + "." + date.getFullYear();
    var totalBarcodes = 0;
    var subTotal = 0;
    var print = print_array;
    qz_array.push("N\n");
    qz_array.push("q550\n");
    qz_array.push("Q303,26\n");
    qz_array.push('TDdd me y4\n');
    var c = 0;
    $.each(print, function(key, value) {
        pB(key, value, date_string);
        c++;
    });
    if (odd) {
        //alert("Inside odd");  
        qz_array.push('\nP1,1\n');
        c++;
        odd = 0;
        // qz_array.push('END');
        total_print_documents++;
        // alert("appending odd");
    } else {
        //  alert("not appending");
    }
    // Mark the end of a label, in this case  P1 plus a newline character
    // qz-printknows to look for this and treat this as the end of a "page"
    // for better control of larger spooled jobs (i.e. 50+ labels)
    //    qz.setEndOfDocument(",1\n");

    // The amount of labels to spool to the printer at a time. When
    // qz-print counts this many `EndOfDocument`'s, a new print job will 
    // automatically be spooled to the printer and counting will start
    // over.
    //  qz.setDocumentsPerSpool("10");
    //alert("Printing: "+c);  
    //alert("Total Documents: "+total_print_documents);
    //alert("Total Barcodes: "+total_barcodes_printed);

    var r = confirm("Are you sure you want to print " + total_barcodes_printed + " barcodes");
    if (r == true) {
        qz.print(config, qz_array).catch(function(e) {
            console.error(e);
        });
    }

    total_print_documents = 0;
    total_barcodes_printed = 0;

    //   monitorPrinting(qz);
}

function printBarcodesNoMRP() {

    if (qz) {
        var config = qz.configs.create("TSC TTP-247")
    } else {
        qz = document.getElementById('qz');
        config = qz.configs.create("TSC TTP-247")
    }

    var date = new Date();
    var date_string = date.getDate() + "." + parseInt(parseInt(date.getMonth()) + 1) + "." + date.getFullYear();
    var totalBarcodes = 0;
    var subTotal = 0;
    var print = print_array;
    qz_array.push("N\n");
    qz_array.push("q550\n");
    qz_array.push("Q303,26\n");
    qz_array.push('TDdd me y4\n');
    var c = 0;
    $.each(print, function(key, value) {
        pBNoMRP(key, value, date_string);
        c++;
    });
    if (odd) {
        //alert("Inside odd");  
        qz_array.push('\nP1,1\n');
        c++;
        odd = 0;
        // qz_array.push('END');
        total_print_documents++;
        // alert("appending odd");
    } else {
        //  alert("not appending");
    }
    // Mark the end of a label, in this case  P1 plus a newline character
    // qz-printknows to look for this and treat this as the end of a "page"
    // for better control of larger spooled jobs (i.e. 50+ labels)
    //qz.setEndOfDocument(",1\n");

    // The amount of labels to spool to the printer at a time. When
    // qz-print counts this many `EndOfDocument`'s, a new print job will 
    // automatically be spooled to the printer and counting will start
    // over.
    //qz.setDocumentsPerSpool("10");
    //alert("Printing: "+c);  
    //alert("Total Documents: "+total_print_documents);
    //alert("Total Barcodes: "+total_barcodes_printed);

    var r = confirm("Are you sure you want to print " + total_barcodes_printed + " barcodes");
    if (r == true) {
        qz.print(config, qz_array).catch(function(e) {
            console.error(e);
        });
    }

    total_print_documents = 0;
    total_barcodes_printed = 0;

    //   monitorPrinting(qz);
}

function pB(key, value, date_string) {
    var quantity = value['quantity'];
    var design = value['design'];
    var color = value['color'];
    var size = value['size'];
    var mrp = value['mrp'];
    var identifier = value['identifier'];
    var category = value['category'];
    if (odd) {
        qz_array.push('B325,20,0,1A,2,2,70,B,"' + key + '"\n');
        qz_array.push('A325,125,0,3,1,1,N,"' + category + '"\n');
        qz_array.push('A325,150,0,4,1,1,N,"' + design + '"\n');
        qz_array.push('A325,182,0,3,1,1,N,"' + color + '"\n');
        qz_array.push('A545,182,0,3,1,1,N,"' + size + '"\n');
        qz_array.push('A325,205,0,3,1,1,N,"' + identifier + '"\n');
        qz_array.push('A325,230,0,3,1,1,N,"M.R.P. Rs. ' + mrp + '"\n');
        qz_array.push('A325,252,0,2,1,1,N,"(Inclu. of all taxes)"\n');
        qz_array.push('A325,275,0,1,1,1,N,"Pcs 1 Pkd. Dt: ' + date_string + '"\n');
        qz_array.push('\nP1,1\n');
        total_barcodes_printed++;
        total_print_documents++;
        odd = 0;
        quantity--;
    }
    if (quantity > 0) {
        var v = Math.floor(quantity / 2);
        if (quantity % 2 == 0 || Math.floor(quantity / 2) > 0) {
            var set = Math.floor(quantity / 2);
            var remaining = quantity % 2;
            qz_array.push('\nN\n');
            qz_array.push('B0,20,0,1A,2,2,70,B,"' + key + '"\n');
            qz_array.push('B325,20,0,1A,2,2,70,B,"' + key + '"\n');

            qz_array.push('A0,125,0,3,1,1,N,"' + category + '"\n');
            qz_array.push('A325,125,0,3,1,1,N,"' + category + '"\n');

            qz_array.push('A0,150,0,4,1,1,N,"' + design + '"\n');
            qz_array.push('A325,150,0,4,1,1,N,"' + design + '"\n');

            qz_array.push('A0,182,0,3,1,1,N,"' + color + '"\n');
            qz_array.push('A325,182,0,3,1,1,N,"' + color + '"\n');

            qz_array.push('A190,182,0,3,1,1,N,"' + size + '"\n');
            qz_array.push('A545,182,0,3,1,1,N,"' + size + '"\n');

            qz_array.push('A0,205,0,3,1,1,N,"' + identifier + '"\n');
            qz_array.push('A325,205,0,3,1,1,N,"' + identifier + '"\n');

            qz_array.push('A0,230,0,3,1,1,N,"M.R.P. Rs. ' + mrp + '"\n');
            qz_array.push('A325,230,0,3,1,1,N,"M.R.P. Rs. ' + mrp + '"\n');

            qz_array.push('A0,252,0,2,1,1,N,"(Inclu. of all taxes)"\n');
            qz_array.push('A325,252,0,2,1,1,N,"(Inclu. of all taxes)"\n');

            qz_array.push('A0,275,0,1,1,1,N,"Pcs 1 Pkd. Dt: ' + date_string + '"\n');
            qz_array.push('A325,275,0,1,1,1,N,"Pcs 1 Pkd. Dt: ' + date_string + '"\n');
            qz_array.push('\nP' + set + ',1\n');
            total_barcodes_printed += set * 2;
            total_print_documents++;
        }


        if (remaining || Math.floor(quantity / 2) == 0) {
            qz_array.push('\nN\n');
            qz_array.push('B0,20,0,1A,2,2,70,B,"' + key + '"\n');
            qz_array.push('A0,125,0,3,1,1,N,"' + category + '"\n');
            qz_array.push('A0,150,0,4,1,1,N,"' + design + '"\n');
            qz_array.push('A0,182,0,3,1,1,N,"' + color + '"\n');
            qz_array.push('A190,182,0,3,1,1,N,"' + size + '"\n');
            qz_array.push('A0,205,0,3,1,1,N,"' + identifier + '"\n');

            qz_array.push('A0,230,0,3,1,1,N,"M.R.P. Rs. ' + mrp + '"\n');
            qz_array.push('A0,252,0,2,1,1,N,"(Inclu. of all taxes)"\n');
            qz_array.push('A0,275,0,1,1,1,N,"Pcs 1 Pkd. Dt: ' + date_string + '"\n');


            total_barcodes_printed++;
            odd = 1;
            remaining = 0;
        }
    }

}

function pBNoMRP(key, value, date_string) {
    var quantity = value['quantity'];
    var design = value['design'];
    var color = value['color'];
    var size = value['size'];
    var mrp = value['mrp'];
    var wsp = value['wsp'];
    var identifier = value['identifier'];
    var category = value['category'];
    if (odd) {
        qz_array.push('B325,20,0,1A,2,2,70,B,"' + key + '"\n');
        qz_array.push('A325,125,0,3,1,1,N,"' + category + '"\n');
        qz_array.push('A325,150,0,4,1,1,N,"' + design + '"\n');
        //qz_array.push('A325,150,0,3,1,1,N,"' + design + '_' + 'F00' + wsp + '00V' + '"\n');
        qz_array.push('A325,182,0,3,1,1,N,"' + color + '"\n');
        qz_array.push('A545,182,0,3,1,1,N,"' + size + '"\n');
        qz_array.push('A325,205,0,3,1,1,N,"' + identifier + '"\n');
        //qz_array.push('A325,230,0,3,1,1,N,"M.R.P. Rs. ' + mrp + '"\n');
        //qz_array.push('A325,252,0,2,1,1,N,"(Inclu. of all taxes)"\n');
        qz_array.push('A325,275,0,1,1,1,N,"Pcs 1 Pkd. Dt: ' + date_string + '"\n');
        qz_array.push('\nP1,1\n');
        total_barcodes_printed++;
        total_print_documents++;
        odd = 0;
        quantity--;
    }
    if (quantity > 0) {
        var v = Math.floor(quantity / 2);
        if (quantity % 2 == 0 || Math.floor(quantity / 2) > 0) {
            var set = Math.floor(quantity / 2);
            var remaining = quantity % 2;
            qz_array.push('\nN\n');
            qz_array.push('B0,20,0,1A,2,2,70,B,"' + key + '"\n');
            qz_array.push('B325,20,0,1A,2,2,70,B,"' + key + '"\n');

            qz_array.push('A0,125,0,3,1,1,N,"' + category + '"\n');
            qz_array.push('A325,125,0,3,1,1,N,"' + category + '"\n');

            qz_array.push('A0,150,0,4,1,1,N,"' + design + '"\n');
            qz_array.push('A325,150,0,4,1,1,N,"' + design + '"\n');

            //qz_array.push('A0,150,0,3,1,1,N,"' + design + '_' + 'F00' + wsp + '00V' + '"\n');
            //qz_array.push('A325,150,0,3,1,1,N,"' + design + '_' + 'F00' + wsp + '00V' + '"\n');

            qz_array.push('A0,182,0,3,1,1,N,"' + color + '"\n');
            qz_array.push('A325,182,0,3,1,1,N,"' + color + '"\n');

            qz_array.push('A190,182,0,3,1,1,N,"' + size + '"\n');
            qz_array.push('A545,182,0,3,1,1,N,"' + size + '"\n');

            qz_array.push('A0,205,0,3,1,1,N,"' + identifier + '"\n');
            qz_array.push('A325,205,0,3,1,1,N,"' + identifier + '"\n');

            //qz_array.push('A0,230,0,3,1,1,N,"M.R.P. Rs. ' + mrp + '"\n');
            //qz_array.push('A325,230,0,3,1,1,N,"M.R.P. Rs. ' + mrp + '"\n');

            //qz_array.push('A0,252,0,2,1,1,N,"(Inclu. of all taxes)"\n');
            //qz_array.push('A325,252,0,2,1,1,N,"(Inclu. of all taxes)"\n');

            qz_array.push('A0,275,0,1,1,1,N,"Pcs 1 Pkd. Dt: ' + date_string + '"\n');
            qz_array.push('A325,275,0,1,1,1,N,"Pcs 1 Pkd. Dt: ' + date_string + '"\n');
            qz_array.push('\nP' + set + ',1\n');
            total_barcodes_printed += set * 2;
            total_print_documents++;
        }


        if (remaining || Math.floor(quantity / 2) == 0) {
            qz_array.push('\nN\n');
            qz_array.push('B0,20,0,1A,2,2,70,B,"' + key + '"\n');
            qz_array.push('A0,125,0,3,1,1,N,"' + category + '"\n');
            qz_array.push('A0,150,0,4,1,1,N,"' + design + '"\n');
            //qz_array.push('A0,150,0,3,1,1,N,"' + design + '_' + 'F00' + wsp + '00V' + '"\n');
            qz_array.push('A0,182,0,3,1,1,N,"' + color + '"\n');
            qz_array.push('A190,182,0,3,1,1,N,"' + size + '"\n');
            qz_array.push('A0,205,0,3,1,1,N,"' + identifier + '"\n');

            //qz_array.push('A0,230,0,3,1,1,N,"M.R.P. Rs. ' + mrp + '"\n');
            //qz_array.push('A0,252,0,2,1,1,N,"(Inclu. of all taxes)"\n');
            qz_array.push('A0,275,0,1,1,1,N,"Pcs 1 Pkd. Dt: ' + date_string + '"\n');


            total_barcodes_printed++;
            odd = 1;
            remaining = 0;
        }
    }

}

/*
function printBarcodes_tags() {
    if (qz) {
        qz.findPrinter('Zebra');
    } else {
        qz = document.getElementById('qz');
        qz.findPrinter('Zebra');
    }
    var date = new Date();
    var date_string = date.getDate() + "." + parseInt(parseInt(date.getMonth()) + 1) + "." + date.getFullYear();
    var totalBarcodes = 0;
    var subTotal = 0;
    var print = print_array;
    var c = 0;
    $.each(print, function(key, value) {
        pB_tags(key, value, date_string);
        c++;
    });
    qz.setEndOfDocument("^XZ");
    qz.setDocumentsPerSpool("10");
    var r = confirm("Are you sure you want to print " + total_barcodes_printed + " barcodes");
    if (r == true) {
        qz.print();
    }
    total_print_documents = 0;
    total_barcodes_printed = 0;
}

function pB_tags(key, value, date_string) {
    var quantity = value['quantity'];
    var design = value['design'];
    var color = value['color'];
    var size = value['size'];
    var mrp = value['mrp'];
    var identifier = value['identifier'];
    var category = value['category'];
    var worker_id = value['worker_id'];
    //var unique_code = "Vamas "+ category + "-" + design + "-" + color + "-" + size + "-" +worker_id;
    for (i = 0; i < quantity; i++) {
        qz_array.push('^XA^MCY^XZ');
        qz_array.push('^XA');
        qz_array.push('^FX Top section with company logo, name and address.');
        qz_array.push('^CF0,60');
        qz_array.push('^BY2,2,80');
        qz_array.push('^FO45,60^BC^FD' + key + '^FS');
        qz_array.push('^FO10,165^GB300,3,3^FS');
        qz_array.push('^FX Second section with recipient address and permit information.');
        qz_array.push('^CFA,20');
        qz_array.push('^FO20,190^FDStyle - ' + design + '^FS');
        qz_array.push('^FO20,220^FDColor - ' + color + '^FS');
        qz_array.push('^FO20,250^FDSize -  ' + size + '^FS');
        qz_array.push('^FO20,280^FDType - ' + identifier + '^FS');
        qz_array.push('^FO20,310^FDQuantity - 1 PC^FS');
        qz_array.push('^FO20,340^FDMFD - ' + date_string + '^FS');
        qz_array.push('^FO10,370^GB300,3,3^FS');
        qz_array.push('^FX Second section with recipient address and permit information.');
        qz_array.push('^CFA,40');
        qz_array.push('^FO20,390^FDMRP Rs.' + mrp + '/-^FS');
        qz_array.push('^CFA,13');
        qz_array.push('^FO80,430^FD(Inclusive of all taxes)^FS');
        qz_array.push('^FO10,440^GB300,3,3^FS');
        qz_array.push('^FX Fourth section (the two boxes on the bottom).');
        qz_array.push('^FO20,460^GB280,180,3^FS');
        qz_array.push('^CFA,15');
        qz_array.push('^FO30,470^FDVamas^FS');
        qz_array.push('^FO30,495^FD3,Jamuna Bhaiya Chawl,^FS');
        qz_array.push('^FO30,520^FDPestom Sagar Road No.3^FS');
        qz_array.push('^FO30,545^FDMumbai - 400089^FS');
        qz_array.push('^FO30,570^FDContact No:25253808^FS');
        qz_array.push('^FO30,595^FDEmail:support@vamas.in^FS');
        qz_array.push('^FO80,620^FDwww.vamas.in^FS');
        qz_array.push('^XZ');
        total_barcodes_printed++;
    }
}
*/

function calculateTotalOld() {
    var barcode = $("#element-1 .barcode").val();
    var i = 1;
    var sum = 0;
    var quantity = 0;

    while (barcode != "" && barcode != null) {
        var mrp = $("#element-" + i + " .mrp").html();
        sum = sum + parseFloat(mrp);
        i++;
        quantity++;
        barcode = $("#element-" + i + " .barcode").val();
    }
    if (isNaN(sum))
        sum = 0;


    $('#billing_amount').val(sum);
    $('#quantity').val(quantity);
    var total = parseFloat(sum).toFixed(2);
    total = parseFloat(total).toFixed(2);
    $('#total').val(total);
}

function monitorPrinting(qz) {
    if (qz != null) {
        if (!qz.isDonePrinting()) {
            window.setTimeout('monitorPrinting()', 100);
        } else {
            var e = qz.getException();
            alert(e == null ? "Printed Successfully" : "Exception occured: " + e.getLocalizedMessage());
        }
    } else {
        //  alert("Applet not loaded!");
    }
}

function changeLocation(path) {
    document.location.href = '../../' + path;
}

/*
 * Used to manage the loaders 
 */
function changeLoaderText(text) {
    //alert($("#loader_text").hmtl());
    $("#loader_text").html(text);
}

function ajaxindicatorstart(text) {
    if (jQuery('body').find('#resultLoading').attr('id') != 'resultLoading') {
        jQuery('body').append('<div id="resultLoading" style="display:none"><div><img src="/images/ajax-loader.gif"><div id="loader_text">' + text + '</div></div><div class="bg"></div></div>');
    } else {
        changeLoaderText(text);
    }
    jQuery('#resultLoading').css({
        'width': '100%',
        'height': '100%',
        'position': 'fixed',
        'z-index': '10000000',
        'top': '0',
        'left': '0',
        'right': '0',
        'bottom': '0',
        'margin': 'auto'
    });

    jQuery('#resultLoading .bg').css({
        'background': '#000000',
        'opacity': '0.7',
        'width': '100%',
        'height': '100%',
        'position': 'absolute',
        'top': '0'
    });

    jQuery('#resultLoading>div:first').css({
        'width': '250px',
        'height': '75px',
        'text-align': 'center',
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'right': '0',
        'bottom': '0',
        'margin': 'auto',
        'font-size': '16px',
        'z-index': '10',
        'color': '#ffffff'

    });

    jQuery('#resultLoading .bg').height('100%');
    jQuery('#resultLoading').fadeIn(300);
    jQuery('body').css('cursor', 'wait');
}

function ajaxindicatorstop() {
    jQuery('#resultLoading .bg').height('100%');
    jQuery('#resultLoading').fadeOut(300);
    jQuery('body').css('cursor', 'default');
}

function reload_page() {
    document.location.href = document.location.href;
}

function organizePagination(pages, page) {
    var count = $('#count option:selected').text();
    if (pages > 0) {
        var paginationRows = "";
        var current_page = page;
        var total_pages = pages;

        var current_first = page - (page % 5);
        var current_last = page + (5 - (page % 5));
        if (current_first < 1)
            current_first = 1;
        if (current_last > total_pages)
            current_last = total_pages;
        if (current_page > 1)
            paginationRows += '<li><a href="#" data-page="previous"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';
        else
            paginationRows += '<li class="disabled"><a href="javascript:void(0)" data-page="disabled"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>';

        for (i = current_first; i < current_last + 1; i++) {
            if (i == page)
                paginationRows += '<li class="active"><a href="#" data-page="' + i + '">' + i + '</a></li>';
            else
                paginationRows += '<li><a href="#" data-page="' + i + '">' + i + '</a></li>';
        }
        if (current_page < total_pages)
            paginationRows += '<li><a href="javascript:void(0)" data-page="next"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li>';
        else
            paginationRows += '<li class="disabled"><a href="javascript:void(0)" data-page="disabled"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li>';

        //$('.pagination-message').html((current_first)+" to "+ (parseInt(current_first) + +count) + " of "+ (pages*count)  )
        $('.pagination:last').empty();
        $('.pagination:last').append(paginationRows);
    } else {
        $('.pagination:last').empty();
    }
}

// Gets the current url's path, such as http://site.com/example/dist/
function getPath() {
    var path = window.location.href;
    return path.substring(0, path.lastIndexOf("/")) + "/";
}

function intToFormat(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    var z = 0;
    var len = String(x1).length;
    var num = parseInt((len / 2) - 1);

    while (rgx.test(x1)) {
        if (z > 0) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        } else {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
            rgx = /(\d+)(\d{2})/;
        }
        z++;
        num--;
        if (num == 0) {
            break;
        }
    }
    return x1 + x2;
}



function tableNavigate(e) {
    var curr_tr_2 = $("#tblDataBodyN").find("tr.warning").first();
    if (e.keyCode == 40) { //down
        if (curr_tr_2.length == 0) {
            curr_tr_2 = $("#tblDataBodyN").find("tr").first();
        } else {
            curr_tr_2.removeClass("warning");
            curr_tr_2 = curr_tr_2.next("tr");
        }
        curr_tr_2.addClass("warning");
    } else if (e.keyCode == 38) { //up
        if (curr_tr_2.length == 0) {
            curr_tr_2 = $("#tblDataBodyN").find("tr").last();
        } else {
            curr_tr_2.removeClass("warning");
            curr_tr_2 = curr_tr_2.prev("tr");
        }
        curr_tr_2.addClass("warning");
    } else if (e.keyCode == 13) { //enter
        $(curr_tr_2).click();
        return false;
    }
}

function getIBMSDate(tempDate) {
    var ibmsDate = new Date(tempDate);

    var dd = ibmsDate.getDate();
    var mm = ibmsDate.getMonth() + 1;

    var yyyy = ibmsDate.getFullYear();

    var hh = ibmsDate.getHours();

    var mm = ibmsDate.getMinutes();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var ibmsDate = yyyy + '-' + mm + '-' + dd + " " + hh + ":" + mm + ":" + ss;
    return ibmsDate;
}
