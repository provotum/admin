import React from "react";
import {Button, Card, Col, Form, Icon, Input, Row} from "antd";
import PropTypes from "prop-types";

class DeployBtnCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    // let's see
    this.props.actions.onClickHandler(this.props.form.getFieldsValue());

  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Card title="Deploy Panel">
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Form.Item label={'Question'}>
              {getFieldDecorator('question', {
                rules: [{ required: true, message: 'Please enter a valid question!' }]
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Voting question"/>
              )}
            </Form.Item>
            <Form.Item label={'P'}>
              {getFieldDecorator('p', {
                rules: [{ required: true, message: 'Please input p'}]
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type={'number'} placeholder="p?" />
              )}
            </Form.Item>
            <Form.Item label={'G'}>
              {getFieldDecorator('g', {
                rules: [{ required: true, message: 'Please input g' }]
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type={'number'} placeholder="g?" />
              )}
            </Form.Item>
          </Row>
          <Row>
            <Col span={24} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit">Search</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

DeployBtnCard.propTypes = {
  actions: PropTypes.shape({
    onClickHandler: PropTypes.func.isRequired
  }),
  form: PropTypes.object
};

export default Form.create()(DeployBtnCard);
