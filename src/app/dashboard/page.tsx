'use client'
import React from 'react';
import { useState, useEffect } from 'react';

interface Resource {
    name: string;
    data: any[];
}

export default function Dashoord() {
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<Resource[]>([]);

    useEffect(() => {
        async function init() {
            setDashboardData(await fetchDashboardData());
            setIsLoading(false);
        }
        init()
    }, [])

    function BusyIndicator({ isBusy }: { isBusy: boolean }) {
        if (!isBusy) {
            return (<></>)
        }
        return (
            <div className="inline-block">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
            </div>
        )
    }

    function ResourceStats({ resource }: { resource?: Resource }) {
        return (
            <div className="border rounded-lg p-4 flex flex-col w-36 h-18 m-2">
                <span className="font-semibold text-xs text-gray-700 capitalize">{resource?.name}</span>
                <span className="text-3xl tracking-wide	text-neutral-600 font-bold">{resource?.data.length}</span>
            </div>
        )
    }

    function Spacer() {
        return <div className="flex-1"></div>
    }

    function ResourceSummary({ resource }: { resource?: Resource }) {
        return (
            <div className="border rounded-lg p-4 flex flex-col space-y-3 w-full m-2 items-stretch">
                <span className="font-semibold text-xs text-gray-700 uppercase">{resource?.name}</span>
                <hr />
                {resource?.data.slice(0, 3).map((v, index) => {
                    return <span className="text-xs line-clamp-1 text-ellipsis">{index + 1}. {v?.name ?? v.title}</span>
                })}
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col space-y-4 mb-8 pb-8">

                <div className="p-5 bg-stone-800 text-white text-center flex space-x-4 items-center justify-center">
                    <span>Dashboard</span>  <BusyIndicator isBusy={isLoading} />
                </div>

                <div className="bg-white border rounded-lg min-h-lg max-w-3xl min-h w-screen p-3 mx-auto flex flex-wrap justify-between items-center">
                    <span className="text-2xl m-2 flex-1">Dashboard <br /> Stats</span>
                    {dashboardData.map((resource, index) => {
                        return <ResourceStats key={index} resource={resource} />;
                    })}
                    <span className="text-2xl m-2 flex-1 text-right">Dashboard <br /> Stats</span>

                </div>

                <div className="bg-white border rounded-lg min-h-lg max-w-3xl w-screen p-3 mx-auto flex flex-wrap justify-between items-stretch">
                    {dashboardData.map((resource, index) => {
                        return <div className="w-1/3 p-2">
                            <ResourceSummary key={index} resource={resource} />
                        </div>
                    })}
                </div>
            </div>
        </>
    )
}


async function fetchResourceData(src: string) {
    const response = await fetch(src);
    return await response.json();
}

async function fetchDashboardData() {

    const src = {
        "posts": "https://jsonplaceholder.typicode.com/posts",
        "comments": "https://jsonplaceholder.typicode.com/comments",
        "albums": "https://jsonplaceholder.typicode.com/albums",
        "photos": "https://jsonplaceholder.typicode.com/photos",
        "todos": "https://jsonplaceholder.typicode.com/todos",
        "users": "https://jsonplaceholder.typicode.com/users",
    }

    // array of objects
    return await Promise.all(
        Object.entries(src).map(
            async ([resource, src]) => {
                return {
                    name: resource,
                    data: await fetchResourceData(src)
                }
            }
        )
    );
}

async function fetchDashboardData01() {
    const src = {
        "posts": "https://jsonplaceholder.typicode.com/posts",
        "comments": "https://jsonplaceholder.typicode.com/comments",
        "albums": "https://jsonplaceholder.typicode.com/albums",
        "photos": "https://jsonplaceholder.typicode.com/photos",
        "todos": "https://jsonplaceholder.typicode.com/todos",
        "users": "https://jsonplaceholder.typicode.com/users",
    }

    // this will be single object like a map
    const dashboardData: { [key: string]: any } = {};

    await Promise.all(
        Object.entries(src).map(
            async ([resource, src]) => {
                dashboardData[resource] = await fetchResourceData(src);
            }
        )
    );

    return dashboardData;
}