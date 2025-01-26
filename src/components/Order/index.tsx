import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    TablePagination,
    Tooltip,
    MenuItem,
    InputLabel,
    FormControl,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/Store';
import { useEffect, useState } from 'react';
import { AppDispatch } from '../../../Redux/Store';
import { AddProduct, DeleteProduct, GetAllProducts, GetProduct, UpdateProduct, UpdateProductData } from "../../../Redux/Slice/productsSlicer"
import SnackBar from '../../Common/Snackbar';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetAllOrders, OrderData, UpdateData, UpdateOrder } from '../../../Redux/Slice/orderSlicer';

export default function index() {
    const dispatch = useDispatch<AppDispatch>();
    const [rows, setRows] = React.useState<GetProduct[]>([]);
    const [open, setOpen] = React.useState(false);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [currentRow, setCurrentRow] = React.useState({
        paymentStatus: "",
        orderStatus: "",
        _id: "",
        productId: "",
        userId: "",
        totalPrice: 0,
        quantity: 0,
        deliveryTime: 0,
        size: "",
        image: "",
        productTitle: "",
        paymentMode: "",


    });
    const [searchText, setSearchText] = React.useState<string>('');
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const { orderItems } = useSelector((state: RootState) => state.order)
    const [SelectPaymentStatus, setSelectPaymentStatus] = React.useState('');
    const [selectOrderStaus, setselectOrderStaus] = useState("")

    const [opendelete, setOpenDelete] = React.useState(false);
    const [deletData, setDeleteData] = React.useState<OrderData>();
    const [openSnackBar, setOpenSnackBar] = React.useState({
        open: false,
        data: ""
    })
    //////addddddddddddddddddddd
    const handleChangeSelect = (event: SelectChangeEvent) => {
        setSelectPaymentStatus(event.target.value as string);
    };
    const handleChangeSelectPayment = (event: SelectChangeEvent) => {
        setselectOrderStaus(event.target.value as string);
    };

    useEffect(() => {
        dispatch(GetAllOrders())
    }, [dispatch]);



    const handleOpenEditDialog = (row: typeof currentRow, index: number) => {
        setSelectPaymentStatus(row.paymentStatus)
        setselectOrderStaus(row.orderStatus)
        setCurrentRow(row);
        setEditingIndex(index);
        setIsEditMode(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        if (isEditMode && editingIndex !== null) {
            const obj: UpdateData = {
                _id: currentRow._id,
                paymentStatus: SelectPaymentStatus,
                orderStatus: selectOrderStaus,

            }
            const { _id } = currentRow;
            const data = await dispatch(UpdateOrder(obj))
            if (data.payload.message) HandleSnackbar(data.payload.message)
        }
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, } = e.target;
        // console.log(e.target)
        setCurrentRow((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
    }

    const HandleDelete = (row: OrderData) => {
        setOpenDelete(true);
        setDeleteData(row)
    }


    const HandleSnackbar = (data: string) => {
        setOpenSnackBar({ open: true, data });
        setTimeout(() => {
            setOpenSnackBar({ ...openSnackBar, open: false });
        }, 2000)
    }

    const DeleteRowData = async () => {
        if (deletData && deletData._id) {
            try {
                const data = await dispatch(DeleteProduct(deletData._id));
                if (data.payload.message) HandleSnackbar(data.payload.message)
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setOpenDelete(false);
            }
        }
    }

    return (
        <>
            <TableContainer component={Paper}  >
                <div className='flex items-center  mb-5'>
                    <div className="w-[90%] font-extrabold text-xl ml-3">
                        All orders
                    </div>

                    <div className="flex justify-end  items-center">
                        <input
                            type="text"
                            value={searchText}
                            onChange={handleInputChange}
                            placeholder="Search..."
                            className="w-64 px-4 py-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-SECONDARY_COLOR"
                        />
                        {/* <Tooltip title="Add Product" className="mr-5">
                            <IconButton onClick={handleOpenAddDialog}>
                                <AddIcon fontSize="large" />
                            </IconButton>
                        </Tooltip> */}
                    </div>
                </div>
                <Table sx={{ minWidth: 650 }} aria-label="banner table">
                    <TableHead className='bg-slate-300'>
                        <TableRow>
                            <TableCell style={{ fontWeight: "bolder" }}>Title</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bolder" }}>Quantity</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bolder" }}>Size</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bolder" }}>Image</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bolder", }}>Payment Status</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bolder" }}>Total Price</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bolder" }}>Order Status</TableCell>
                            <TableCell align="right" style={{ fontWeight: "bolder" }}>Payment mode</TableCell>
                            <TableCell align="right" style={{ fontWeight: "bolder" }}>Delivery date</TableCell>
                            <TableCell align="right" style={{ fontWeight: "bolder" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderItems && orderItems
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" style={{ fontWeight: "bold" }} >
                                        {row.productTitle}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ fontWeight: "bold" }} >
                                        {row.quantity}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ fontWeight: "bold" }} >
                                        {row.size}
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex justify-center">
                                            <img src={row.image} height={45} width={45} alt={row.productTitle} className="rounded-md" />
                                        </div>
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ fontWeight: "bold" }} >
                                        {row.paymentStatus}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ fontWeight: "bold" }} >
                                        ₹ {row.totalPrice}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ fontWeight: "bold" }} >
                                        {row.orderStatus}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ fontWeight: "bold" }} >
                                        {row.paymentMode}
                                    </TableCell>
                                    <TableCell component="th" scope="row" style={{ fontWeight: "bold" }} >
                                        {row.deliveryTime}
                                    </TableCell>
                                    <TableCell align="right">
                                        <EditIcon
                                            className="cursor-pointer text-EDIT_COLOR"
                                            onClick={() => handleOpenEditDialog(row, index)}
                                        />
                                        <DeleteIcon
                                            className="cursor-pointer text-red-700 ml-6"
                                            onClick={() => HandleDelete(row)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 15, 20]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <Dialog open={open} onClose={handleClose} >
                <DialogTitle>{isEditMode ? 'Edit Order' : 'Add New Order'}</DialogTitle>
                <DialogContent  >
                    <FormControl fullWidth style={{ marginTop: "50px" }}>
                        <InputLabel id="demo-simple-select-label">Select Payment Status</InputLabel>
                        <Select
                            style={{ width: "500px" }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={SelectPaymentStatus}
                            label="Select paymentStatus"
                            onChange={handleChangeSelect}
                        >
                            <MenuItem key={1} value={`PAID`}>PAID</MenuItem>
                            <MenuItem key={2} value={`PENDING`}>PENDING</MenuItem>
                            <MenuItem key={3} value={`REFUNDED`}>REFUNDED</MenuItem>

                        </Select>
                    </FormControl>
                    <FormControl fullWidth style={{ marginTop: "50px" }}>
                        <InputLabel id="demo-simple-select-label">Select Order Status</InputLabel>
                        <Select
                            style={{ width: "500px" }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectOrderStaus}
                            label="Select orderstatus"
                            onChange={handleChangeSelectPayment}
                        >
                            <MenuItem key={1} value={`PLACED`}>PLACED</MenuItem>
                            <MenuItem key={2} value={`SHIPPED`}>SHIPPED</MenuItem>
                            <MenuItem key={3} value={`OUT`}>OUT</MenuItem>
                            <MenuItem key={3} value={`DELIVERED`}>DELIVERED</MenuItem>
                            <MenuItem key={3} value={`CANCELLED`}>CANCELLED</MenuItem>
                            <MenuItem key={3} value={`RETURNED`}>RETURNED</MenuItem>

                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {isEditMode ? 'Save Changes' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={opendelete} onClose={handleClose}>
                <DialogContent>Are you sure you want to delete the category "{`${deletData?.productTitle}`}"?. This action cannot be undone.</DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button onClick={DeleteRowData} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <SnackBar
                open={openSnackBar.open}
                data={openSnackBar.data}
            />
        </>
    );
}
