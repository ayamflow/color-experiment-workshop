define(['entities/Vector'], function(Vector) {
   var Letters = {
        a: [
            [
                new Vector(0, 2),
                new Vector(0, 1),
                new Vector(0, 0),
                new Vector(1, 0),
                new Vector(1, 1),
                new Vector(1, 2)
            ],
            [
                new Vector(0, 1),
                new Vector(1, 1)
            ]
        ],
        b: [
            [
                new Vector(0, 2),
                new Vector(0, 0),
                new Vector(1, 0),
                new Vector(1, 2),
                new Vector(0, 2)
            ],
            [
                new Vector(0, 1),
                new Vector(1, 1)
            ]
        ],
        c: [
            [
                new Vector(1, 0),
                new Vector(0, 0),
                new Vector(0, 1),
                new Vector(0, 2),
                new Vector(1, 2)
            ]
        ],
        e: [
            [
                new Vector(1, 0),
                new Vector(0, 0),
                new Vector(0, 1),
                new Vector(0, 2),
                new Vector(1, 2)
            ],
            [
                new Vector(0, 1),
                new Vector(1, 1)
            ]
        ],
        l: [
            [
                new Vector(0, 0),
                new Vector(0, 1),
                new Vector(0, 2),
                new Vector(1, 2)
            ]
        ],
        o: [
            [
                new Vector(1, 0),
                new Vector(0, 0),
                new Vector(0, 1),
                new Vector(0, 2),
                new Vector(1, 2),
                new Vector(1, 1),
                new Vector(1, 0)
            ]
        ],
        p: [
            [
                new Vector(0, 2),
                new Vector(0, 1),
                new Vector(0, 0),
                new Vector(1, 0),
                new Vector(1, 1),
                new Vector(0, 1)
            ]
        ],
        r: [
            [
                new Vector(0, 2),
                new Vector(0, 1),
                new Vector(0, 0),
                new Vector(1, 0),
                new Vector(1, 1),
                new Vector(0, 1),
                new Vector(1, 2)
            ]
        ],
        u: [
            [
                new Vector(0, 0),
                new Vector(0, 1),
                new Vector(0, 2),
                new Vector(1, 2),
                new Vector(1, 1),
                new Vector(1, 0)
            ]
        ]
    };

   return Letters;
});