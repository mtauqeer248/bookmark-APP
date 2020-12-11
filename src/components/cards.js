import { useQuery, useMutation } from '@apollo/client'
import React from 'react';

import gql from 'graphql-tag'

const DELETE_BOOKMARK = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

const GET_BOOKMARKS = gql`
{
    bookmarks {
        id
        url
        title
    }
}
`;



export default function Card({ url, title }) {
const [deleteTask] =useMutation( DELETE_BOOKMARK)
const {loading,error,data} = useQuery( GET_BOOKMARKS)


const handleDelete = (id)=>{
    console.log(JSON.stringify(id))
    deleteTask({
        variables:{
            id:id,
        },
        refetchQueries:[{query:GET_BOOKMARKS}]
        
    });
};

    return <div className="card">
        <p className="url"><b>{url}</b></p>
        <p className="title">{title}</p>
     
    </div>
}