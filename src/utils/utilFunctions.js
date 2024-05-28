// converting [{Key:"X",value:"abc"}] to {X:"abc",...}
export const handleChangeResObj = (resources) => {
  // console.log(" ====>", resources);

  let resourcesObj = {};
  for (let resource of resources) {
    resourcesObj[resource.key] = resource.value;
  }
  // console.log(" ====>", resourcesObj);
  return resourcesObj;
};
