export const getConfig = key => {
  const envValue = `REACT_APP_${key}`;
  return process.env[envValue];
};

// export const getAccess =()=>{
//   if(process.env.NODE_ENV === 'production')
// }
