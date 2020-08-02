import React from 'react';

class IndexPage extends React.Component {
  render() {
    return <a href="/editor">Continue to Editor Demo</a>;
  }
}
IndexPage.propTypes = {};
// export async function getServerSideProps(context) {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
}


export default IndexPage;
