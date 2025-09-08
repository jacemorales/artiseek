function generateHouseSvg(seed) {
    // A simple seeded random number generator to make SVGs different
    let random = Math.sin(seed) * 10000;
    random = random - Math.floor(random);

    const color1 = `hsl(${180 + random * 60}, 70%, 50%)`; // Shades of blue/cyan
    const color2 = `hsl(${200 + random * 60}, 80%, 30%)`; // Deeper blues

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="background-color: ${color2};">
            <defs>
                <linearGradient id="grad-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${color1};stop-opacity:0.3;" />
                    <stop offset="100%" style="stop-color:${color2};stop-opacity:0.8;" />
                </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#grad-${seed})" />
            <path d="M20 80 L20 40 L50 10 L80 40 L80 80 L60 80 L60 50 L40 50 L40 80 Z"
                  fill="none" stroke="#ffffff" stroke-width="3" opacity="0.7" transform="rotate(${random * 10 - 5} 50 50)" />
            <circle cx="${30 + random * 40}" cy="${30 + random * 20}" r="${2 + random * 4}" fill="#ffffff" opacity="0.5" />
        </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const properties = [
    {
        id: 1,
        title: "Luxurious Modern Villa",
        price: "2,500,000",
        location: "Beverly Hills, CA",
        beds: 5,
        baths: 6,
        sqft: 5500,
        image: generateHouseSvg(1),
        description: "An exquisite villa in the heart of Beverly Hills. This property boasts a private pool, home theater, and breathtaking city views. The ultimate in luxury living.",
        images: [
            generateHouseSvg(11),
            generateHouseSvg(12),
            generateHouseSvg(13),
            generateHouseSvg(14)
        ]
    },
    {
        id: 2,
        title: "Cozy Suburban Family Home",
        price: "750,000",
        location: "Austin, TX",
        beds: 4,
        baths: 3,
        sqft: 2800,
        image: generateHouseSvg(2),
        description: "A beautiful family home in a quiet suburban neighborhood. Features a large backyard, a modern kitchen, and is close to top-rated schools.",
        images: [
            generateHouseSvg(21),
            generateHouseSvg(22),
            generateHouseSvg(23),
            generateHouseSvg(24)
        ]
    },
    {
        id: 3,
        title: "Chic Downtown Loft",
        price: "1,100,000",
        location: "New York, NY",
        beds: 2,
        baths: 2,
        sqft: 1600,
        image: generateHouseSvg(3),
        description: "A stylish loft in a prime downtown location. Open-concept living space with industrial-chic design, exposed brick, and stunning city views.",
        images: [
            generateHouseSvg(31),
            generateHouseSvg(32),
            generateHouseSvg(33)
        ]
    },
    {
        id: 4,
        title: "Rustic Mountain Cabin",
        price: "550,000",
        location: "Aspen, CO",
        beds: 3,
        baths: 2,
        sqft: 2000,
        image: generateHouseSvg(4),
        description: "Escape to this charming rustic cabin with stunning mountain views. Features a stone fireplace, wood beams, and a large deck perfect for nature lovers.",
        images: [
            generateHouseSvg(41),
            generateHouseSvg(42),
            generateHouseSvg(43)
        ]
    }
];
