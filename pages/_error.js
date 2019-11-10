// Error Page
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { Row, Col } from './../src/components/layout/grid';

export default class ErrorPage extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    return (
      <>
        <Head>
          <title>Opps {this.props.statusCode}</title>
        </Head>

        <Row>
          <Col xs={12}>
            <p>
              {this.props.statusCode
                ? `A ${
                  this.props.statusCode
                } error occurred. You might have a broken link.`
                : 'An error occurred on client'}
            </p>
          </Col>
        </Row>
      </>
    );
  }
}

ErrorPage.propTypes = {
  statusCode: PropTypes.any
};
