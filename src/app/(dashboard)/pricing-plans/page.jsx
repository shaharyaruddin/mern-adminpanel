"use client";
import React, { useEffect, useReducer } from 'react';
import { fetchReducer } from '../../(api-response)/reducer/FetchReducer';
import { FETCH_INITIAL_STATE } from '../../(api-response)/states/FetchInitialState';
import { FETCH_ACTION_STATE } from '../../(api-response)/states/FetchActionState';
import axios from 'axios';
import TableLoader from '@/components/TableLoader';
import { toast } from 'sonner';
import { DataNotFound } from '@/components/DataNotFound';
import DataTable from '@/components/DataTable';
import { getPricingPlan } from '../../../../constraint/api/auth.route';



const PricingPlan = () => {
  const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);

  const fetchPricingPlans = async () => {
    dispatch({ type: FETCH_ACTION_STATE.FETCH_START });
    try {
      const { data } = await axios.get(getPricingPlan);
      dispatch({ type: FETCH_ACTION_STATE.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_ACTION_STATE.FETCH_ERROR });
      toast.error("Failed to fetch pricing plans: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const pricingPlanColumns = ["id", "plan_name", "createdAt", "updatedAt"];

  const handleDelete = async (plan) => {
    try {
      await axios.delete(`${getPricingPlans}/${plan.id}`);
      toast.success("Pricing plan deleted");
      fetchPricingPlans();
    } catch (error) {
      toast.error("Failed to delete pricing plan: " + (error.response?.data?.message || error.message));
      console.log(error);
    }
  };

  const getEditLink = (row) => `/pricing-plans/edit/${row.id}`; // Function to generate edit link

  const actions = [
    { label: "Edit", link: getEditLink },
    {
      label: "Delete",
      onClick: handleDelete,
      confirmMessage: "Are you sure you want to delete this pricing plan? This action cannot be undone.",
    },
  ];

  if (state.LOADING) {
    return <TableLoader />;
  } else if (state.ERROR) {
    return <h2 className="p-4 text-center text-red-500">Error</h2>;
  } else {
    const plans = Array.isArray(state.DATA) ? state.DATA : (state.DATA?.data || []);
    if (plans.length === 0) {
      return <DataNotFound title="Pricing plans not found" />;
    } else {
      return (
        <div className="p-4">
          <DataTable
            data={plans}
            columns={pricingPlanColumns}
            title="Pricing Plans"
            showFooter={false}
            actions={actions}
          />
        </div>
      );
    }
  }
};

export default PricingPlan;