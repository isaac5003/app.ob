import { format } from "date-fns";
import { es } from "date-fns/locale";
const getHeader = (name, nit, nrc, lastDay, docName, dateType = 'date', preTitle = null) => {
    let title = docName
    if (lastDay) {
        let date = null
        switch (dateType) {
            case 'date':
                date = format(lastDay, 'dd - MMMM - yyyy', { locale: es }).split('-').join('de')
                title = `${docName} AL ${date}`
                break;
            case 'month':
                date = format(lastDay, 'MMMM - yyyy', { locale: es }).split('-').join('de')
                title = `${docName} PARA EL MES DE ${date}`
                break
            case 'period':
                console.log(lastDay);
                const fromDate = format(lastDay[0], 'dd/MM/yyyy')
                const toDate = format(lastDay[1], 'dd/MM/yyyy')
                title = `${docName} EN EL PERÍODO DEL ${fromDate} AL ${toDate}`
                break
        }
    }
    return (currentPage, pageCount, pageSize) => {
        let header = [
            {
                columns: [
                    {
                        text: name.toUpperCase(),
                        fontSize: 12,
                        bold: true,

                    }
                ],
                margin: [20, 15, 20, 0],
            },
        ]

        if (!preTitle === null) {
            header.push(
                {
                    columns: [
                        {
                            text: preTitle,
                            fontSize: 10,
                            margin: [0, 5, 0, 0],
                        },
                    ],
                    margin: [20, 0, 20, 0],
                },
            )
        }
        header.push(
            {
                columns: [
                    {
                        text: title.toUpperCase(),
                        fontSize: 10,
                        margin: [0, 5, 0, 0],
                        width: '70%'
                    },
                    {
                        text: [
                            {
                                text: 'NIT: ',
                                bold: true
                            },
                            {
                                text: nit
                            },
                            {
                                text: '  NRC: ',
                                bold: true
                            },
                            {
                                text: nrc
                            }
                        ],
                        fontSize: 9,
                        alignment: 'right',
                        margin: [0, 5, 0, 0],
                        width: '30%'
                    }
                ],
                margin: [20, 0, 20, 0],
            },
            {
                canvas: [{ type: 'line', x1: 20, y1: 5, x2: pageSize.width - 20, y2: 5, lineWidth: 1 }]
            }
        )
        return header
    }
}

const getFooter = () => {
    return (currentPage, pageCount, pageSize) => {
        return [
            {
                canvas: [{ type: 'line', x1: 20, y1: 5, x2: pageSize.width - 20, y2: 5, lineWidth: 1 }]
            },
            {
                columns: [
                    {
                        text: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
                        fontSize: 9,
                        margin: [0, 5, 0, 0]

                    },
                    {
                        text: `${currentPage.toString()} / ${pageCount}`,
                        fontSize: 9,
                        alignment: 'right',
                        margin: [0, 5, 0, 0]
                    }
                ],
                margin: [20, 0, 20, 0],
            }
        ]
    }
}
export {
    getHeader,
    getFooter,
};  