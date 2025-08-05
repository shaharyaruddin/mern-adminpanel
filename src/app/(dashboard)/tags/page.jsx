"use client"
import React, { useEffect, useReducer } from 'react'
import { fetchReducer } from '../../(api-response)/reducer/FetchReducer';
import { FETCH_INITIAL_STATE } from '../../(api-response)/states/FetchInitialState';
import { FETCH_ACTION_STATE } from '../../(api-response)/states/FetchActionState';
import { getTags, getTools } from '../../../../constraint/api/auth.route';
import TableLoader from '@/components/tableLoader';
import { toast } from 'sonner';
import axios from 'axios';
import { DataNotFound } from '@/components/DataNotFound';
import DataTable from '@/components/DataTable';

const Tags = () => {
   const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);
  
    const fetchTags = async () => {
      dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
      try {
        const { data } = await axios.get(getTags);        
        dispatch({ type: FETCH_ACTION_STATE.FETCH_SUCCESS, payload: data  });
      } catch (error) {
        dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
        toast.error("Failed to fetch tags: " + (error.response?.data?.message || error.message));
      }
    };
  
    useEffect(() => {
      fetchTags();
    }, []);
    
    const tagTableColumns = ["id", "name"];
  
    const handleDelete = async (tag) => {
      try {
        await axios.delete(`${getTags}/${tag.id}`); 
        toast.success("Tag deleted");
        fetchTags(); 
      } catch (error) {
        toast.error("Failed to delete tag: " + (error.response?.data?.message || error.message));
        console.log(error);
      }
    };
  
    const getEditLink = (row) => `/tags/edit/${row.id}`; // Function to generate edit link
  
    const actions = [
      { label: "Edit", link: getEditLink },
      {
        label: "Delete",
        onClick: handleDelete,
        confirmMessage: "Are you sure you want to delete this tag? This action cannot be undone.",
      },
    ];
  
    if (state.LOADING) {
      return <TableLoader />;
    } else if (state.ERROR) {
      return <h2 className="p-4 text-center text-red-500">Error</h2>;
    } else {
      const tags = Array.isArray(state.DATA) ? state.DATA : (state.DATA?.data || []);
      if (tags.length === 0) {
        return <DataNotFound title="Tags not found" />;
      } else {
        return (
          <div className="p-4">
            <DataTable
              data={tags}
              columns={tagTableColumns}
              title="Tags"
              showFooter={false}
              actions={actions}
            />
          </div>
        );
      }
    }
}

export default Tags