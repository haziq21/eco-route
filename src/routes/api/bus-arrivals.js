export async function get() {
    // DataMall API URL
    const dataMallUrl = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2';
    const stopCodeParam = '?BusStopCode=19049';

    // Send HTTP request
    const res = await fetch(dataMallUrl + stopCodeParam, {
        headers: {
            AccountKey: 'cmWAPZxsRe+1Dahcw+wBVQ=='
        }
    });

    // Convert HTTP response to JSON
    const data = await res.json();

    if (res) {
        return {
            body: {
                // Resetructure JSON data
                data: formatArrivals(data)
            }
        };
    }
}

function formatArrivals(data) {
    // Some bus numbers / codes have letters as well as numbers,
    // so here we're sorting by number first then by letter.
    function busNumberSort(bus1, bus2) {
        // Extract numbers from bus code
        const number1 = bus1.serviceNumber.match(/\d+/g);
        const number2 = bus2.serviceNumber.match(/\d+/g);

        // bus1 and bus2 don't have the same number 
        // (e.g. 7A and 7B have the same number)
        if (number1 !== number2) {
            // bus1 and bus2 are strings but are coerced into numbers
            return number1 - number2;
        }

        // Sort alphabetically
        return bus1 > bus2 ? 1 : -1;
    }

    return {
        busStopCode: data.BusStopCode,
        services: data.Services
            // Reformat JSON data
            .map(x => formatService(x))
            // Sort bus numbers 
            .sort(busNumberSort)
    };
}

function formatService(data) {
    return {
        serviceNumber: data.ServiceNo,
        arrivals: [
            formatBus(data.NextBus),
            formatBus(data.NextBus2),
            formatBus(data.NextBus3)
        ]
    };
}

function formatBus(data) {
    return {
        minutesToArrival: Math.floor(
            Math.max(
                new Date(data.EstimatedArrival) - new Date(), 0
            ) / 60000  // 60,000 miliseconds in a minute
        )
    };
}