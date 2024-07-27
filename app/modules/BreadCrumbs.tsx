import {useMatches} from '@remix-run/react';

function BreadCrumbs() {
  const matches = useMatches();
  console.log('🚀 ~ matches1:', matches);
  return <div>BreadCrumbs</div>;
}

export default BreadCrumbs;
