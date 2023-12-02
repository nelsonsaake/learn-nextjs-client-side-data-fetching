'use client'
import React from 'react';
import useSWR from 'swr';

interface Resource {
    name: string;
    data: any[];
}

export default function Dashoord() {

    const { data, error, isLoading } = useSWR<Resource[]>('dashboard', fetchDashboardData)

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
        return (
            <div className="flex-1 bg-stone-800 p-4 rounded-lg">
                <div className="w-48"></div>
            </div>
        )
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

    function Error() {
        return <>
            <div className="bg-red-100 border border-red-200 text-red-600 rounded-lg min-h-lg max-w-3xl min-h w-screen p-8 mx-auto flex flex-col space-y-2">
                {error}
            </div>
        </>
    }

    function Body() {
        return <>
            <div className="bg-white border rounded-lg min-h-lg max-w-3xl min-h w-screen p-3 mx-auto flex flex-wrap justify-between items-center">
                <div className="text-2xl m-4 w-full">
                    Dashboard Stats
                    <hr />
                </div>
                <hr />
                <Spacer />{data?.map((resource: Resource, index: number) => {
                    return <ResourceStats key={index} resource={resource} />;
                })}<Spacer />
            </div>
            <div className="bg-white border rounded-lg min-h-lg max-w-3xl w-screen p-3 mx-auto flex flex-wrap justify-between items-stretch">
                <div className="text-2xl m-4 w-full">
                    Dashboard Summary
                    <hr />
                </div>
                {data?.map((resource: Resource, index: number) => {
                    return <div className="w-1/3 p-2">
                        <ResourceSummary key={index} resource={resource} />
                    </div>
                })}
            </div>
        </>
    }

    return (
        <>
            <div className="flex flex-col space-y-4 mb-8 pb-8">

                <div className="p-5 bg-stone-800 text-white text-center flex space-x-4 items-center justify-center">
                    <span>Dashboard</span>  <BusyIndicator isBusy={isLoading} />
                </div>

                {error && <Error />}

                {!error && <Body />}
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