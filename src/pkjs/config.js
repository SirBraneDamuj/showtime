module.exports = [
    {
        type: 'section',
        items: [
            {
                type: 'heading',
                defaultValue: 'Colors'
            },
            {
                type: 'color',
                messageKey: 'ColorHour',
                label: 'Hour Hand',
                defaultValue: '0055FF'
            },
            {
                type: 'color',
                messageKey: 'ColorMinute',
                label: 'Minute Dot',
                defaultValue: 'AA0000'
            },
            {
                type: 'color',
                messageKey: 'ColorRing',
                label: 'Outer Ring',
                defaultValue: 'AAAA00'
            },
            {
                type: 'color',
                messageKey: 'ColorInnerRing',
                label: 'Inner Ring',
                defaultValue: 'FFFFFF'
            }
        ]
    },
    {
        type: 'section',
        items: [
            {
                type: 'button',
                defaultValue: 'Reset to Defaults',
                id: 'reset-defaults'
            }
        ]
    },
    {
        type: 'submit',
        defaultValue: 'Save'
    }
];
