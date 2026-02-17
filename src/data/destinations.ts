export interface Destination {
    id: string;
    name: string;
    image: string;
    description: string;
    properties: string[];
}

export const destinations: Destination[] = [
    {
        id: 'goa',
        name: 'Goa',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=400',
        description: 'Sun, sand, and parties.',
        properties: ['Beach', 'Nightlife', 'Relax']
    },
    {
        id: 'manali',
        name: 'Manali',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=400',
        description: 'Snow-capped peaks and adventure.',
        properties: ['Mountain', 'Adventure', 'Snow']
    },
    {
        id: 'kerala',
        name: 'Kerala',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=400',
        description: 'God\'s own country with backwaters.',
        properties: ['Nature', 'Relax', 'Culture']
    },
    {
        id: 'rishikesh',
        name: 'Rishikesh',
        image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&q=80&w=400',
        description: 'Yoga capital and rafting adventure.',
        properties: ['Spiritual', 'Adventure', 'River']
    },
    {
        id: 'jaipur',
        name: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=400',
        description: 'The Pink City with royal palaces.',
        properties: ['History', 'Culture', 'Architecture']
    },
    {
        id: 'ladakh',
        name: 'Ladakh',
        image: 'https://images.unsplash.com/photo-1482164565953-04b62dc3dfdf?auto=format&fit=crop&q=80&w=400',
        description: 'High passes and stark beauty.',
        properties: ['Adventure', 'Mountain', 'Roadtrip']
    },
    {
        id: 'coorg',
        name: 'Coorg',
        image: 'https://images.unsplash.com/photo-1596324520935-779836968038?auto=format&fit=crop&q=80&w=400',
        description: 'Scotland of India, coffee and hills.',
        properties: ['Nature', 'Hill Station', 'Coffee']
    },
    {
        id: 'andaman',
        name: 'Andaman',
        image: 'https://images.unsplash.com/photo-1550951298-5c7b95a66b90?auto=format&fit=crop&q=80&w=400',
        description: 'Pristine beaches and coral reefs.',
        properties: ['Beach', 'Diving', 'Island']
    }
];
