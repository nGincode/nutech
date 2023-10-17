import React, { Component, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Input, Textarea, Button } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import numeral from "numeral";

import Select from "../components/reactSelect";
import ImgUpload from "../components/imgUpload";
import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput"

export default function Spwp({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [dataPermission, setdataPermission] = useState([]);
    const [dataCreate, setdataCreate] = useState();
    const [search, setsearch] = useState('');
    const URLAPI = "/api/stock";
    const Subject = "Stock";

    useEffect(() => {
        setpagePermission(userData?.permission?.data?.map((val: any) => {
            return val.data.find((vall: any) => {
                if (vall.label == Subject) {
                    return vall;
                }
            })
        })?.filter((val: any) => val !== undefined)?.[0]?.checklist ?? [])
    }, [userData]);

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'create') {
            try {
                await axios({
                    method: "POST",
                    url: URLAPI,
                    data: data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    setdataCreate(res.data.data)
                    toast.success(res.data.massage);
                    ($('.btn-close') as any).trigger("click");
                    (document.getElementById('formCreate') as HTMLFormElement).reset();
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        }
    }


    const convertFileToBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    }

    const submitAdd = async (event: any) => {
        event.preventDefault();
        let img = null;
        let files = event.target.file.files?.[0];
        if (files) {
            let extension = files.type;
            let size = files.size;
            if (extension === 'image/jpeg' || extension === 'image/png') {
                if (size > 100000) {
                    return toast.error("Size img only < 100kb");
                } else {
                    img = await convertFileToBase64(files);
                }
            } else {
                return toast.error("Extension img not valid, only jpeg/png");
            }
        }


        let data = {
            stock: numeral(event.target.stock.value).value(),
            name: event.target.name.value,
            price_buy: numeral(event.target.price_buy.value).value(),
            price_sell: numeral(event.target.price_sell.value).value(),
            stock_val: event.target.stock.value,
            img: img
        };

        handleApi('create', data);


    };

    const byNumeral = (val: any) => {
        let value = numeral(val.target.value).format('0,0');
        (document.getElementById(val.target.id) as HTMLInputElement).value = value;
    }

    return (
        <>
            <div className="row mb-32 gy-32">
                <div className="col-12">
                    <div className="row justify-content-between gy-32">
                        <div className="col hp-flex-none w-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link href="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {Subject}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>


                <div className="col-12 mt-10">
                    <div className="row g-16 align-items-center justify-content-end">
                        <div className="col-12 col-md-6 col-xl-4">
                            <div className="input-group align-items-center">
                                <DebouncedInput
                                    value={search ?? ''}
                                    onChange={value => setsearch(String(value))}
                                    className="form-control ps-8"
                                    placeholder="Search all columns..."
                                />
                            </div>
                        </div>

                        {pagePermission.find((val: any) => val == "create") ?
                            <div className="col hp-flex-none w-auto">
                                <Button type="button" className="w-100 px-5" variant="gradient" color="orange" data-bs-toggle="modal" data-bs-target="#addNewUser"><i className="ri-add-line remix-icon"></i> Add Stock</Button>
                            </div>
                            : null}

                        <div className="modal fade -mt-2" id="addNewUser" tabIndex={-1} aria-labelledby="addNewUserLabel" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header py-16 px-24">
                                        <h5 className="modal-title font-bold" id="addNewUserLabel">Add Stock</h5>
                                        <button type="button" className="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                                            <i className="ri-close-line hp-text-color-dark-0 lh-1" style={{ fontSize: "24px" }}></i>
                                        </button>
                                    </div>

                                    <div className="divider m-0"></div>
                                    <form onSubmit={submitAdd} id="formCreate">
                                        <div className="modal-body">
                                            <ImgUpload
                                                name="file"
                                                id="file" />
                                            <div className="row gx-8">
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <Input type="text" required variant="standard" className="border-b-1" name="name" label="Name Stock" id="name" />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <Input type="number" step="any" required variant="standard" className="border-b-1" name="stock" label="Stock" id="stock" />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <Input type="text" onChange={byNumeral} required variant="standard" className="border-b-1" name="price_buy" label="Purchase Price" id="price_buy" />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <Input type="text" onChange={byNumeral} required variant="standard" className="border-b-1" name="price_sell" label="Selling Price" id="price_sell" />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="modal-footer pt-0 px-24 pb-24">
                                            <div className="divider"></div>
                                            <Button type="submit" className="w-full" color="blue">Submit</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card hp-contact-card mb-32 -mt-3 shadow-md">
                        <div className="card-body px-0">
                            <ReactTable
                                search={search}
                                action={{
                                    delete: pagePermission.find((val: any) => val == "delete") ? URLAPI : null,
                                    edit: pagePermission.find((val: any) => val == "edit") ? URLAPI : null
                                }}
                                urlFatch={URLAPI}
                                reload={dataCreate}
                                modalData={[
                                    {
                                        name: 'img',
                                        type: 'img',
                                        id: 'img',
                                        full: true
                                    },
                                    {
                                        name: 'name',
                                        type: 'text',
                                        label: 'Name Stock',
                                        id: 'name',
                                        required: true
                                    },
                                    {
                                        name: 'stock',
                                        type: 'number',
                                        id: 'stock',
                                        required: true
                                    },
                                    {
                                        name: 'priceBuy',
                                        type: 'number',
                                        id: 'price_buy',
                                        required: true,
                                        numeral: true,
                                        label: "Purchase Price"
                                    },
                                    {
                                        name: 'priceSell',
                                        type: 'number',
                                        label: "Selling Price",
                                        id: 'price_sell',
                                        required: true,
                                        numeral: true,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}