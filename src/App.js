import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import axios from 'axios';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import {
  Typography,
  Grid,
  Button,
  TextField,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  IconButton,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  FormControl,
  InputLabel,

} from '@material-ui/core';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  labelColor: {
    color: '#b6b5b5'
  },
  dialog: {
    margin: '0px 0px 0px auto',
    left: '0px',
    right: "auto",
    [theme.breakpoints.up('xl')]: {
      width: "25%"
    },
    [theme.breakpoints.up('lg')]: {
      width: "25%"
    },
    [theme.breakpoints.up('md')]: {
      width: "25%"
    },
    [theme.breakpoints.up('sm')]: {
      width: "25%"
    },
  },
  dialogtitlestyle: {
    float: "left",
    fontSize: "1rem",
    padding: "5px",
    color: theme.palette.primary.main
  },
  dropDown: {
    padding: "10px 10px",
    '&:hover': {
      padding: "10px 10px",
      backgroundColor: "rgba(218, 218, 218, 0.87)",
    },
  },
  rootTable: {
    width: '100%'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  rootToolbar: {
    padding: theme.spacing(0, 2)
  },
  title: {
    flex: '1 1 100%',
  },
  title1: {
    flex: '1 1 100%',
    marginLeft: '20px'
  },
  table: {
    width: '100%'
  },
  TableCell: {
    padding: "0px 16px"
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});


class AddRoleModal extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);

    this.state = {
      rows: [],
      allUsers: [],
      order: 'asc',
      orderBy: "lid",
      rowsPerPage: 5,
      page: 0,
      userName: "",
      address: "",
      mobileNumber: "",
      email: "",
      password: "",
      city: "",
      states: "",
      checkbox: false,
      gender: "",
      loggedIn: false,
      errors: {
      },
      errorsHelper: {
      },
      allCity: [
        { id: 1, label: "Ahemdabad" },
        { id: 2, label: "Udaypur" },
        { id: 3, label: "Mumbai" },
        { id: 4, label: "Agra" },
        { id: 5, label: "Indor" },
      ],
      allState: [
        { id: 1, label: "Gujarat" },
        { id: 2, label: "Rajsthan" },
        { id: 3, label: "Maharastra" },
        { id: 4, label: "U.P.(Uttar Pradesh)" },
        { id: 5, label: "M.P.(Madhya Pradesh)" },
      ],
      headCells: [
        { id: 'userName', label: "User Name" },
        { id: 'password', label: "Password" },
        { id: 'mobileNumber', label: "Mobile Number" },
        { id: 'email', label: "Email" },
        { id: 'gender', label: "Gender" },
        { id: 'states', label: "State" },
        { id: 'city', label: "City" },
        { id: 'address', label: "Address" },
      ],
    }
  }


  handleCheckboxChange = (e) => {
    this.setState({
      checkbox: e.target.checked
    })
  }

  componentDidMount() {
    this.fetchUserList();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleFocusStates = (e) => {
    this.setState(prevState => ({
      errors: {
        ...prevState.errors,
        states: false
      },
      errorsHelper: {
        ...prevState.errorsHelper,
        states: ""
      }

    }))
  }

  handleFocusCity = (e) => {
    this.setState(prevState => ({
      errors: {
        ...prevState.errors,
        city: false
      },
      errorsHelper: {
        ...prevState.errorsHelper,
        city: ""
      }

    }))
  }

  handleFocus = (e) => {
    let state = e.target.name;
    this.setState(prevState => ({
      errors: {
        ...prevState.errors,
        [state]: false
      },
      errorsHelper: {
        ...prevState.errorsHelper,
        [state]: ""
      }

    }))
  }

  handleLoginSubmit = (value) => {

    if (this.state.email === "") {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,

          email: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          email: "Please enter email"
        }
      }))
    }

    if (this.state.password === "") {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,

          password: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          password: "Please enter password"
        }
      }))
    }

    if (this.state.email === ""
      || this.state.password === "") {
      return;
    }

    axios.post(`http://localhost:8888/userLogin`,
      {
        email: this.state.email,
        password: this.state.password,
      })
      .then(response => {
        if (response.data.success === 1) {
          this.setState({
            loggedIn: true,
            logModal: false
          })
        }
        else {
          alert(" FAILED LOGGED IN!!!  YOU NEED TO ENTER PROPER EMAIL ID AND PASSWORD OR DO SIGN UP ")
        }

      })
      .catch(err => {
        console.log(err);
      });
    this.setState({ addlogModal: false })
  }

  handleLogoutSubmit = () => {
    alert(" YOU ARE LOGGED OUT !!!")
    this.setState({
      logModal: false,
      loggedIn: false
    })
  }

  handleSubmit = () => {
    if (this.state.userName === "") {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,

          userName: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          userName: "Please enter user name"
        }
      }))
    }

    if (this.state.email === "") {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,

          email: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          email: "Please enter email address"
        }
      }))

    }

    var newEmail = this.state.email
    if (newEmail && !newEmail.match(/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,3})$/)) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          email: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          email: "Please enter valid email address"
        }
      }))

    }

    if (this.state.password === "") {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,

          password: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          password: "Please enter password"
        }
      }))
    }

    if (this.state.mobileNumber === "") {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          mobileNumber: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          mobileNumber: "Please enter mobile number"
        }
      }))
    }

    var newMobileNumber = this.state.mobileNumber
    if (newMobileNumber && !newMobileNumber.match(/^([+][9][1]|[9][1]|[0]){0,1}([6-9]{1})([0-9]{9})$/)) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          mobileNumber: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          mobileNumber: "Please enter valid mobile number"
        }
      }))
    }

    if (this.state.city === "") {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          city: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          city: "Please choose city"
        }
      }))
    }



    if (this.state.states === "") {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          states: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          states: "Please choose state"
        }
      }))
    }

    if (this.state.address === "") {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          address: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          address: "Please enter address"
        }
      }))
    }

    if (this.state.gender === "") {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          gender: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          gender: "Please choose gender"
        }
      }))
    }

    if (this.state.checkbox === false) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          checkbox: true
        },
        errorsHelper: {
          ...prevState.errorsHelper,
          checkbox: "Please select checkbox"
        }
      }))
    }

    if (this.state.userName === ""
      || this.state.mobileNumber === ""
      || !(newMobileNumber.match(/^([+][9][1]|[9][1]|[0]){0,1}([6-9]{1})([0-9]{9})$/))
      || this.state.email === ""
      || !(newEmail.match(/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,3})$/))
      || this.state.password === ""
      || this.state.city === ""
      || this.state.states === ""
      || this.state.address === ""
      || this.state.gender === ""
      || this.state.checkbox === false) {
      return;
    }

    axios.post(`http://localhost:8888/addNewUsers`,
      {
        userName: this.state.userName,
        password: this.state.password,
        email: this.state.email,
        mobileNumber: this.state.mobileNumber,
        address: this.state.address,
        city: this.state.city,
        states: this.state.states,
        gender: this.state.gender,
        acceptedterms: this.state.checkbox
      })
      .then(response => {
        this.setState({
          loggedIn: true
        })
        this.fetchUserList()
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      addModal: false,
      logModal: false
    })
  }

  fetchUserList = () => {
    axios.post(`http://localhost:8888/viewUsers`,
      {
      })
      .then(response => {
        if (response.data.success === 1) {
          this.setState({
            rows: response.data.data.allUsers
          })
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  addModalOpen = () => {
    this.setState({
      addModal: true,
      userName: "",
      password: "",
      email: "",
      address: "",
      mobileNumber: "",
      city: "",
      states: "",
      gender: "",
      checkbox: "",
    });
  }

  addModalClose = () => {
    this.setState({
      addModal: false,
      logModal: false,
      allCity: [],
      allState: [],
      errors: {}
    });
  }

  logModalOpen = () => {
    this.setState({
      logModal: true,
      userName: "",
      email: "",
      password: "",
      address: "",
      mobileNumber: "",
      city: "",
      states: "",
    });
  }

  logModalClose = () => {
    this.setState({
      logModal: false,
      addModal: false,
      allCity: [],
      allState: [],
      errors: {}
    });
  }

  createSortHandler = (property) => (event) => {
    const isAsc = this.state.orderBy === property && this.state.order === 'asc';

    this.setState({
      order: isAsc ? 'desc' : 'asc',
      orderBy: property
    })
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    })
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid
        className={classes.root}
        container
        spacing={3}
      >

        <div className={classes.rootTable}>
          <Paper className={classes.paper}>
            <Toolbar variant="regular" className={classes.rootToolbar}>
              <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                Table Name: Users Data
              </Typography>
              {this.state.loggedIn
                ?
                <Tooltip title="Logout" arrow>
                  <IconButton aria-label="filter list">
                    <Button onClick={() => { this.handleLogoutSubmit() }} style={{ marginRight: "20px", height: "50px", backgroundColor: "#3f51b5", color: "white" }} >
                      Log Out
                  </Button>
                  </IconButton>
                </Tooltip>
                :
                <Tooltip title="Login" arrow>
                  <IconButton aria-label="filter list">
                    <Button onClick={() => { this.logModalOpen() }} style={{ height: "50px", backgroundColor: "#3f51b5", color: "white" }} >
                      Log In
                  </Button>
                  </IconButton>
                </Tooltip>
              }
            </Toolbar>

            {this.state.loggedIn
              ?
              <TableContainer>
                <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size='medium'
                  aria-label="enhanced table"
                >
                  <TableHead>
                    <TableRow>
                      {this.state.headCells.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          sortDirection={this.state.orderBy === headCell.id ? this.state.order : false}
                        >
                          <TableSortLabel
                            active={this.state.orderBy === headCell.id}
                            direction={this.state.orderBy === headCell.id ? this.state.order : 'asc'}
                            onClick={this.createSortHandler(headCell.id)}
                          >
                            {headCell.label}
                            {this.state.orderBy === headCell.id ? (
                              <span className={classes.visuallyHidden}>
                                {this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </span>
                            ) : null}
                          </TableSortLabel>

                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {stableSort(this.state.rows, getComparator(this.state.order, this.state.orderBy))
                      .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow
                            hover
                            tabIndex={-1}
                            key={row.id}
                          >
                            <TableCell className={classes.TableCell}>{row.userName}</TableCell>
                            <TableCell className={classes.TableCell}>{row.password}</TableCell>
                            <TableCell className={classes.TableCell}>{row.mobileNumber}</TableCell>
                            <TableCell className={classes.TableCell}>{row.email}</TableCell>
                            <TableCell className={classes.TableCell}>{row.gender}</TableCell>
                            <TableCell className={classes.TableCell}>{row.states}</TableCell>
                            <TableCell className={classes.TableCell}>{row.city}</TableCell>
                            <TableCell className={classes.TableCell}>{row.address}</TableCell>
                          </TableRow>
                        );
                      })}

                    {this.state.rows.length < 1 ?
                      <TableRow>
                        <TableCell colSpan={8} style={{ height: 50, textAlign: "center" }}>
                          No Data Found...
                      </TableCell>
                      </TableRow> : ""
                    }
                  </TableBody>
                </Table>

                <TablePagination
                  labelRowsPerPage="Rows"
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  component="div"
                  count={this.state.rows.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableContainer>
              :
              <Typography className={classes.title1} color="error" variant="h6" id="tableTitle" component="div">
                YOU NEED TO LOG IN TO VIEW THE USER'S DATA
              </Typography>
            }

          </Paper>


          <Dialog className={classes.dialog} maxWidth fullScreen open={this.state.addModal} onClose={this.addModalClose} TransitionComponent={Transition}>
            <DialogTitle style={{ padding: "8px 35px 8px 20px" }}>
              <Typography className={classes.dialogtitlestyle} variant="h6" >
                Sign Up
            </Typography>
            </DialogTitle>

            <DialogContent dividers>

              <Grid container spacing={2}>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    label="User Name"
                    value={this.state.userName}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    variant="outlined"
                    size="small"
                    error={this.state.errors.userName}
                    helperText={this.state.errors.userName ? this.state.errorsHelper.userName : ""}
                    name="userName"
                    fullWidth
                  />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    error={this.state.errors.mobileNumber}
                    helperText={this.state.errors.mobileNumber ? this.state.errorsHelper.mobileNumber : ""}
                    placeholder="Enter your mobileNumber"
                    variant="outlined"
                    InputLabelProps={{ classes: { root: classes.labelColor } }}
                    fullWidth
                    size="small"
                    label="Mobile Number"
                    defaultValue={this.state.mobileNumber}
                    name="mobileNumber"
                    type="number"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                  />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    error={this.state.errors.email}
                    helperText={this.state.errors.email ? this.state.errorsHelper.email : ""}
                    placeholder="Enter your email"
                    variant="outlined"
                    InputLabelProps={{ classes: { root: classes.labelColor } }}
                    fullWidth
                    size="small"
                    label="Email"
                    defaultValue={this.state.email}
                    name="email"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                  />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    error={this.state.errors.password}
                    helperText={this.state.errors.password ? this.state.errorsHelper.password : ""}
                    placeholder="Enter your password"
                    variant="outlined"
                    InputLabelProps={{ classes: { root: classes.labelColor } }}
                    fullWidth
                    size="small"
                    label="Password"
                    defaultValue={this.state.password}
                    name="password"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                  />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    select
                    label="State"
                    value={this.state.states}
                    onFocus={this.handleFocusStates}
                    onChange={this.handleChange}
                    variant="outlined"
                    size="small"
                    error={this.state.errors.states}
                    helperText={this.state.errors.states ? this.state.errorsHelper.states : ""}
                    name="states"
                    fullWidth
                  >

                    {this.state.allState.map((item) => {
                      return (
                        <option key="state1" value={item.label} className={classes.dropDown}>
                          {item.label}
                        </option>
                      )
                    })}
                  </TextField>
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    select
                    label="City"
                    value={this.state.city}
                    onChange={this.handleChange}
                    onFocus={this.handleFocusCity}
                    variant="outlined"
                    size="small"
                    error={this.state.errors.city}
                    helperText={this.state.errors.city ? this.state.errorsHelper.city : ""}
                    name="city"
                    fullWidth
                  >
                    {this.state.allCity.map((item) => {
                      return (
                        <option key="state1" value={item.label} className={classes.dropDown}>
                          {item.label}
                        </option>
                      )
                    })}
                  </TextField>
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    error={this.state.errors.address}
                    helperText={this.state.errors.address ? this.state.errorsHelper.address : ""}
                    placeholder="Enter your address"
                    variant="outlined"
                    InputLabelProps={{ classes: { root: classes.labelColor } }}
                    fullWidth
                    rows={4}
                    multiline
                    size="small"
                    label="Address"
                    defaultValue={this.state.address}
                    name="address"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                  />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup aria-label="gender"
                      name="gender"
                      value={this.state.gender}
                      onChange={this.handleChange}
                      error={this.state.errors.gender}
                      helperText={this.state.errors.gender ? this.state.errorsHelper.gender : ""}
                    >
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <Typography>
                    <Checkbox
                      error={this.state.errors.checkbox}
                      helperText={this.state.errors.checkbox ? this.state.errorsHelper.checkbox : ""}
                      name="checkbox"
                      value={this.state.checkbox}
                      checked={this.state.checked}
                      onChange={this.handleCheckboxChange}
                      color="primary"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    I have accepted all terms.
                </Typography>
                </Grid>

              </Grid>

            </DialogContent>

            <DialogActions>
              <Tooltip title="Sign Up" arrow>
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  startIcon={<SaveIcon />}
                  onClick={this.handleSubmit}
                >
                  Sign Up
            </Button>
              </Tooltip>
              <Tooltip title="Close" arrow>
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  onClick={this.addModalClose}
                  startIcon={<CloseIcon />}
                >
                  Go Back
            </Button>
              </Tooltip>
            </DialogActions>
          </Dialog>


          <Dialog className={classes.dialog} maxWidth fullScreen open={this.state.logModal} onClose={this.logModalClose} TransitionComponent={Transition}>
            <DialogTitle style={{ padding: "8px 35px 8px 20px" }}>
              <Typography className={classes.dialogtitlestyle} variant="h6" >
                Log In
            </Typography>
            </DialogTitle>

            <DialogContent dividers>

              <Grid container spacing={2}>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    error={this.state.errors.email}
                    helperText={this.state.errors.email ? this.state.errorsHelper.email : ""}
                    placeholder="Enter your email"
                    variant="outlined"
                    InputLabelProps={{ classes: { root: classes.labelColor } }}
                    fullWidth
                    size="small"
                    label="Email"
                    name="email"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                  />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    error={this.state.errors.password}
                    helperText={this.state.errors.password ? this.state.errorsHelper.password : ""}
                    placeholder="Enter your password"
                    variant="outlined"
                    InputLabelProps={{ classes: { root: classes.labelColor } }}
                    fullWidth
                    size="small"
                    label="Password"
                    name="password"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                  />
                </Grid>

                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <Typography color="primary">Don't have an account?</Typography>                  
                    <Tooltip title="Sign Up" arrow>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        style={{ marginLeft: "10px" }}
                        startIcon={<SaveIcon />}
                        onClick={this.addModalOpen}
                      >
                        Sign Up
                      </Button>
                    </Tooltip>
                </Grid>

              </Grid>

            </DialogContent>

            <DialogActions>
              <Tooltip title="Login" arrow>
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  startIcon={<SaveIcon />}
                  onClick={this.handleLoginSubmit}
                >
                  Log In
              </Button>
              </Tooltip>
              <Tooltip title="Close & Go Back" arrow>
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  onClick={this.logModalClose}
                  startIcon={<CloseIcon />}
                >
                  Go Back
              </Button>
              </Tooltip>
            </DialogActions>
          </Dialog>



        </div>

      </Grid>
    )
  }
}

export default withStyles(styles)(AddRoleModal);