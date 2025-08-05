export const baseUri = process.env.NEXT_PUBLIC_API_BASE_URI;

const authRoutes = baseUri + '/auth';
export const registerUserEndPoint = authRoutes+ '/register' 
export const loginEndPoint = authRoutes+ '/login' 
export const logoutEndPoint = authRoutes+ '/logout' 
export const verifyEmailEndPoint = authRoutes+ '/verifyemail' 
export const getUsersEndPoint = authRoutes+ '/verifyemail' 
export const getAllUserEndPoint = authRoutes+ '/users' 
export const getAllBlockUserEndPoint = authRoutes+ '/users/block' 
export const getRoleEndPoint = authRoutes+ '/roles' ;

export const getUserWithIdORUsernameEndPoint = baseUri+ '/profile'
export const getUserUpdateEndPoint = baseUri+ '/profile/update' ;
export const userBlockOrUnblockEndPoint = baseUri+ '/profile/active' ;

export const getTags = baseUri + '/tags'
export const addTag = getTags + '/add'

export const getCategories = baseUri + '/categories';
export const addCategory = getCategories + '/add';

export const getTools = baseUri + '/tools'
export const addTool = getTools + '/add'
export const getToolByid = getTools + '/edit'

export const getPricingPlan = baseUri + '/pricing-plans'
export const addPricingPlan = getPricingPlan + '/add'

export const getRankedTools = baseUri + '/ranking/tools'

