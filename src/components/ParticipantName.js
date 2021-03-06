import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'react-emotion';
import { Manager, withTheme } from '@twilio/flex-ui';

const Name = styled('div')`
    font-size: 14px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

class ParticipantName extends React.Component {
  state = {
    name: ''
  };

  componentDidMount() {
    const { participant, serviceBaseUrl } = this.props;
    const { callSid } = participant;
    const manager = Manager.getInstance();
    const token = manager.user.token;

    const getCallPropertiesUrl = (
      `https://${serviceBaseUrl}/get-call-properties?token=${token}&callSid=${callSid}`
    );
    fetch(getCallPropertiesUrl)
      .then(response => response.json())
      .then(json => {
        if (json) {
          console.warn('Call properties:\r\n', json);
          const name = (json && json.to) || '';
          this.setState({ name });
        }
      });
  }

  render() {
    return (
      <Name className="ParticipantCanvas-Name">
        {this.state.name}
      </Name>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { serviceBaseUrl } = state.flex.config;
  const { participant } = ownProps;
  const componentViewStates = state.flex.view.componentViewStates;
  const customParticipants = componentViewStates.customParticipants || {};
  const participantState = customParticipants[participant.callSid];

  return {
    participantName: participantState && participantState.name,
    serviceBaseUrl,
  };
};

export default connect(mapStateToProps)(withTheme(ParticipantName));
