import React from "react";
import {Button, Card, Col, Form, Icon, Input, Row} from "antd";
import PropTypes from "prop-types";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class DeployBtnCard extends React.Component {

  constructor(props) {
    super(props);

    this.props.form.validateFields();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields((err) => {
      if (!err) {
        this.props.actions.onClickHandler(this.props.form.getFieldsValue());
      }
    });
  }

  render() {
    const {getFieldDecorator, getFieldsError} = this.props.form;

    let isInputDisabled = this.props.isDeployed;

    let isButtonDisabled = false;
    if (!this.props.isConnected || this.props.isDeploying || this.props.isDeployed || hasErrors(getFieldsError())) {
      isButtonDisabled = true;
    }

    return (
      <Card title="Deploy Panel">
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Form.Item label={'Question'}>
              {getFieldDecorator('question', {
                rules: [{required: true, message: 'Please enter a valid question!'}]
              })(
                <Input disabled={isInputDisabled}
                       prefix={<Icon type="question-circle-o" style={{color: 'rgba(0,0,0,.25)'}}/>}
                       placeholder="Voting question"/>
              )}
            </Form.Item>
          </Row>
          <Row>
            <Col span={24} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit" disabled={isButtonDisabled ? "disabled" : false}>Deploy</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

DeployBtnCard.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  isDeploying: PropTypes.bool.isRequired,
  isDeployed: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    onClickHandler: PropTypes.func.isRequired
  }),
  form: PropTypes.object
};

export default Form.create()(DeployBtnCard);
