import React from "react";
import Paper from "@material-ui/core/Paper";
import {getAllPersons} from "../service/BackendAPI";
import {DataGrid, GridOverlay} from '@material-ui/data-grid';
import LinearProgress from "@material-ui/core/LinearProgress";
import SearchBar from "material-ui-search-bar";
import makeStyles from "@material-ui/core/styles/makeStyles";

const renderImage = (params) => (
    <img alt="profile_picture" height="80px" width="80px" style={{borderRadius: "50%"}} src={process.env.REACT_APP_MEDIA_URL + params.value} />
);

function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
}
const useStyles = makeStyles((theme) => ({
    root: {
        flexDirection: 'column',
        '& .ant-empty-img-1': {
            fill: theme.palette.type === 'light' ? '#aeb8c2' : '#262626',
        },
        '& .ant-empty-img-2': {
            fill: theme.palette.type === 'light' ? '#f5f5f7' : '#595959',
        },
        '& .ant-empty-img-3': {
            fill: theme.palette.type === 'light' ? '#dce0e6' : '#434343',
        },
        '& .ant-empty-img-4': {
            fill: theme.palette.type === 'light' ? '#fff' : '#1c1c1c',
        },
        '& .ant-empty-img-5': {
            fillOpacity: theme.palette.type === 'light' ? '0.8' : '0.08',
            fill: theme.palette.type === 'light' ? '#f5f5f5' : '#fff',
        },
    },
    label: {
        marginTop: theme.spacing(1),
    },
}));

function CustomNoRowsOverlay() {
    const classes = useStyles();

    return (
        <GridOverlay className={classes.root}>
            <svg
                width="120"
                height="100"
                viewBox="0 0 184 152"
                aria-hidden
                focusable="false"
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(24 31.67)">
                        <ellipse
                            className="ant-empty-img-5"
                            cx="67.797"
                            cy="106.89"
                            rx="67.797"
                            ry="12.668"
                        />
                        <path
                            className="ant-empty-img-1"
                            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                        />
                        <path
                            className="ant-empty-img-2"
                            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                        />
                        <path
                            className="ant-empty-img-3"
                            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                        />
                    </g>
                    <path
                        className="ant-empty-img-3"
                        d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                    />
                    <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                        <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                        <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                    </g>
                </g>
            </svg>
            <div className={classes.label}>Aucun résultat</div>
        </GridOverlay>
    );
}

export default class Persons extends React.Component {
    state = {
        search: "",
        loading: true,
        persons: [],
        columns: [
            { field: 'profile_picture', headerName: 'Photos', width: 120, renderCell: renderImage },
            { field: 'first_name', headerName: 'Prénom', width: 150 },
            { field: 'last_name', headerName: 'Nom', width: 150 },
            { field: 'phone_number', headerName: 'Tél.', width: 120 },
            { field: 'email', headerName: 'Email', width: 250 },
            { field: 'hiring_date', headerName: 'Arrivée', width: 120 },
            { field: 'birthday', headerName: 'Anniversaire', width: 140 },
        ],
        displayPersons: []
    };

    search() {
        this.setState({loading: true});
        let {search, persons} = this.state;
        let filterFunc = word => item => (Object.keys(item)
                .filter(k => k !== 'profile_picture' && typeof(item[k]) === typeof("string"))
                .map(k => item[k].toLowerCase().includes(word.toLowerCase()))
                .reduce((a, v) => (a||v), false)
        );

        let newPersons = persons.filter(item => search.split(' ')
            .map(filterFunc).map(ffunc => ffunc(item))
            .reduce((a, v) => (a && v), true));
        this.setState({displayPersons: newPersons, loading: false});
    }

    componentDidMount() {
        this.setState({loading: true});
        getAllPersons().then(response => this.setState({persons: response, displayPersons: response, loading: false}));
    }

    render() {
        const width = this.state.columns.reduce((a, v) => a + v.width, 0);
        return (
            <Paper style={{marginTop: "40px", marginBottom: "60px", width: width+20}}>
                <SearchBar
                    onChange={(value) => this.setState({search: value}, this.search)}
                    onCancelSearch={() => this.setState({search: ""}, this.search)}
                />
                <DataGrid
                    disableSelectionOnClick
                    localeText={{labelRowsPerPage: "test"}}
                    loading={this.state.loading}
                    components={{
                        LoadingOverlay: CustomLoadingOverlay,
                        NoRowsOverlay: CustomNoRowsOverlay
                    }}
                    autoHeight
                    rowHeight={100}
                    columns={this.state.columns}
                    rows={this.state.displayPersons} />
            </Paper>
        );
    }
}
