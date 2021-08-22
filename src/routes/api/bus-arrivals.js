export async function get({ params }) {
    const dataMallUrl = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2';
    const stopCodeParam = '?BusStopCode=19049';

    const res = await fetch(dataMallUrl + stopCodeParam, {
        headers: {
            AccountKey: 'cmWAPZxsRe+1Dahcw+wBVQ=='
        }
    });
    const data = await res.json();

    if (res) {
        return {
            body: {
                data
            }
        };
    }
}