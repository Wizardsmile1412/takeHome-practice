interface BloodData2 {
    _id: string;
    bloodGroup: 'A' | 'B' | 'AB' | 'O'; // A, B, AB, O
    status: 'available' | 'reserved'; 
    expiryDate: string; // '2024-08-10T10:50:21',
    bookingDate: string; // '2024-08-10T10:50:21',
}

const listOfBloodBag2: BloodData2[] = [
    {
        _id: '1',
        bloodGroup: 'A',
        status: 'available',
        expiryDate: '2024-08-10T10:50:21',
        bookingDate: '2024-08-07T09:30:18',
    },
    {
        _id: '2',
        bloodGroup: 'A',
        status: 'available',
        expiryDate: '2024-08-14T11:00:00',
        bookingDate: '2024-08-01T09:30:18',
    },
    {
        _id: '3',
        bloodGroup: 'B',
        status: 'reserved',
        expiryDate: '2024-08-10T10:00:00',
        bookingDate: '2024-08-03T09:30:18',
    },
    {
        _id: '4',
        bloodGroup: 'A',
        status: 'available',
        expiryDate: '2024-08-12T10:50:21',
        bookingDate: '2024-08-07T09:30:18',
    },
    {
        _id: '5',
        bloodGroup: 'A',
        status: 'available',
        expiryDate: '2024-08-09T10:50:21',
        bookingDate: '2024-08-07T09:30:18',
    },
];



function selectBlood(bloodGroup: BloodData2['bloodGroup'], listOfBloodBag: BloodData2[]): BloodData2[] {
    const SEVEN_DAYS_IN_MS = 1000*60*60*24*7;

    const selectedBlood = listOfBloodBag.filter((bag)=> {
        if (!bag.expiryDate) return false
        if (bag.bloodGroup !== bloodGroup) return false;
        if (bag.status !== 'available') return false;

        let diff = new Date(bag.expiryDate).getTime() - new Date(bag.bookingDate).getTime()
        
        const expireSoon = diff < SEVEN_DAYS_IN_MS && diff > 0;

        return expireSoon 
    }).sort((a,b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())

    return selectedBlood;
}

console.log(selectBlood('A', listOfBloodBag2))