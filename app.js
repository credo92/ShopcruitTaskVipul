
    var http = require('https'),
    // count variable will store no of pages
    count,
    // storing count url in a variable , studied order api documentation
    countUrl = 'https://shopicruit.myshopify.com/admin/orders/count.json?&access_token=c32313df0d0ef512ca64d5b336a0d7c6',
    // storing orders url
    ordersUrl = 'https://shopicruit.myshopify.com/admin/orders.json?page=+'+i+'&access_token=c32313df0d0ef512ca64d5b336a0d7c6',
    // revenue value will store revenue of all orders for a particular URL
    revenue=0.0,
    i,
    // Revenues Array will store and add (current + previous) revenues of all orders,
    //hence last item will be the
    // Total Order Revenue for all order pages
    revenuesArray=[];

    console.log('Calculating ... in 26 seconds');
    // GET request to get count.json
    http.get(countUrl,function(res){
            // SUCCESS status code check
            if(res.statusCode===200)
            {
                var body = '';
                // response has event listeners data and end
                res.on('data',function(data) {
                      body = body + data;
                });

                res.on('end',function(data){

                  var countReceived = JSON.parse(body);
                  count = countReceived.count;
                  urlBuilder(count);
                });

            }
            else
            {
                  console.log('ERROR');
            }
    }).on('error',function(e) {
       console.log("Got an error: ", e);
    });


// creating an array of all the urls of ORDER PAGES
var urls = [];

function urlBuilder(count)
{
  for (i = 1; i <=count; i++)
  {
   urls.push('https://shopicruit.myshopify.com/admin/orders.json?page='+i+'&access_token=c32313df0d0ef512ca64d5b336a0d7c6');
  }
   // Calling function to calculate TOTAL ORDER REVENUE
   calculateRevenueForAllUrls(urls);
}





// Function definition for calculating Revenue For All Order Pages Urls

function calculateRevenueForAllUrls(urls)
{
  // selecting the last element of URL Array and deleting simultaneously
  var url = urls.pop();
  // http request
  http.get(url,function(res)
  {

          var chunks = '';
              //checking success code
              if(res.statusCode===200)
                {                   // response listeners  data, end
                                    res.on('data',function(d)
                                    {
                                      chunks += d;
                                      });

                                    res.on('end',function()
                                    {
                                       var shopifyResponse = JSON.parse(chunks);
                                       // for loop to loop over all orders
                                       for (var i = 0; i < shopifyResponse.orders.length; i++)
                                       {
                                          // Adding revenues of all orders
                                          revenue = revenue + parseFloat(shopifyResponse.orders[i].total_price);

                                        }

                                          revenuesArray.push(revenue);

                                          if(urls.length)
                                          { // recursive call till there are urls left
                                          calculateRevenueForAllUrls(urls);
                                          }
                                          else
                                           {  // Total Order Revenue

                                             return console.log('Total Order Revenue for all order pages : '+revenuesArray[revenuesArray.length-1].toFixed(2)+' CAD & '+ (revenuesArray[revenuesArray.length-1]*.753258).toFixed(2)+' USD according to exchange rate on 22nd January 2017');

                                           }
                                   });

                }

     }).on('error',function(e) {
        console.log("Got an error: ", e);
     });
}
