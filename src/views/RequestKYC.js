import React, { useEffect } from 'react';
import { Container, Button, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useAppContext } from '../components/context/AppDataProvider';

import Pagination from '../components/common/Pagination';
import AlertMessage from '../components/common/AlertMessage';

const RequestKYC = ({ page, previous, next }) => {
  const { app, api, handleError, updateApp, setAppData } = useAppContext();
  const activeUser = app.settings.flow === 'kyb' ? app.users.find(user => app.settings.kybHandle === user.handle) : app.activeUser;
  const isActive = app.success.find(success => activeUser && success.handle === activeUser.handle && success[app.settings.flow] && success.page === page) ? true : false;

  const requestKyc = async () => {
    console.log(`Requesting ${app.settings.flow.toUpperCase()} ...`);
    try {
      const res = await api.requestKYC(activeUser.handle, activeUser.private_key)
      let result = { kyc: {}, kyb: {} };
      console.log('  ... completed!');
      if (res.data.status === 'SUCCESS') {
        result.alert = { message: `Submitted for ${app.settings.flow.toUpperCase()} Review`, type: 'wait' };
        result[app.settings.flow].alert = { message: 'Submitted for review', type: 'wait' };
      } else {
        result[app.settings.flow].alert = { message: res.data.message, type: 'danger' };
      }
      setAppData({
        success: app.success.filter(success => activeUser && success.handle === activeUser.handle && success[app.settings.flow] && success.page !== page),
        responses: [{
          endpoint: '/request_kyc',
          result: JSON.stringify(res, null, '\t')
        }, ...app.responses]
      }, () => {
        updateApp({ ...result });
      });
    } catch (err) {
      console.log('  ... looks like we ran into an issue!');
      handleError(err);
    }
  }

  const checkKyc = async () => {
    console.log(`Checking ${app.settings.flow.toUpperCase()} ...`);
    try {
      const res = await api.checkKYC(activeUser.handle, activeUser.private_key);
      let result = { kyc: {}, kyb: {} };
      console.log('  ... completed!');
      if (res.data.verification_status.includes('passed')) {
        result.alert = { message: res.data.message, type: 'success' };
        result[app.settings.flow].alert = { message: 'Passed ID verification', type: 'success' };
      } else if (res.data.verification_status.includes('failed')) {
        result.alert = { message: res.data.message, type: 'danger' };
        result[app.settings.flow].alert = { message: 'Failed ID verification', type: 'danger' };
      } else {
        result.alert = res.data.message.includes('requested') ? { message: res.data.message, type: 'danger' } : { message: `${activeUser.handle} is still pending ID verification.`, type: 'wait' };
        if (!res.data.message.includes('requested')) result[app.settings.flow].alert = { message: 'Pending ID verification', type: 'warning' };
      }
      if (res.data.members) {
        result[app.settings.flow].members = res.data.members;
      }
      setAppData({
        success: res.data.verification_status.includes('passed') && !isActive ? [...app.success, { handle: activeUser.handle, [app.settings.flow]: true, page }] : app.success,
        responses: [{
          endpoint: '/check_kyc',
          result: JSON.stringify(res, null, '\t')
        }, ...app.responses]
      }, () => {
        updateApp({ ...result });
      });
    } catch (err) {
      console.log('  ... looks like we ran into an issue!');
      handleError(err);
    }
  }

  useEffect(() => {
    if (isActive) updateApp({ [app.settings.flow]: { message: 'Passed ID verification', type: 'success' } });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container fluid className={`main-content-container d-flex flex-column flex-grow-1 loaded ${page.replace('/', '')}`}>

      <h1 className="mb-4">Request {app.settings.flow.toUpperCase()}</h1>

      <p className="text-lg text-meta mb-4">{app.settings.flow === 'kyc' ? 'We must verify that all users of the Sila platform are who they say they are, present a low fraud risk, and are not on any watchlists. We do this by submitting end-user information for KYC review by our identity verification partner, Alloy. The user will not be able to transact until the user is verified.  With great power comes great responsibility.' : 'We must verify that all users of the Sila platform are who they say they are, present a low fraud risk, and are not on any watchlists. The members of this business will be submitted for KYC review and their end-user information will be reviewed by our identity verification partner, Alloy. The business will not be able to transact until all users are verified. Additionally, the business will be submited for KYB review, to ensure that all information is correct.'}</p>

      <p className="text-lg text-meta mb-4">Verification may take a few minutes, so make sure to refresh and check your status.</p>

      <p className="text-meta">This page represents <a href="https://docs.silamoney.com/docs/request_kyc" target="_blank" rel="noopener noreferrer">/request_kyc</a> and <a href="https://docs.silamoney.com/docs/check_kyc" target="_blank" rel="noopener noreferrer">/check_kyc</a> functionality.</p>

      <p className="mt-5 mb-5"><Button className="float-right" onClick={requestKyc} disabled={isActive}>Request {app.settings.flow.toUpperCase()}</Button></p>

      {app.settings.flow === 'kyc' && app[app.settings.flow].alert && (app[app.settings.flow].alert.type === 'primary' || app[app.settings.flow].alert.type === 'wait') && <Alert variant="info" className="mb-4 loaded">While you wait for the {app.settings.flow.toUpperCase()} review to process, go ahead and <NavLink to="/accounts" className="text-reset text-underline">Link an account</NavLink></Alert>}

      <div className="d-flex mb-3">
        <h2>{app.settings.flow.toUpperCase()} Review Status</h2>
        {!isActive[app.settings.flow] && <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={(props) => <Tooltip id={`${app.settings.flow}-tooltip`} className="ml-2" {...props}>Checks {app.settings.flow.toUpperCase()}</Tooltip>}
        >
          <Button variant="link" className="p-0 ml-auto text-reset text-decoration-none loaded" onClick={checkKyc}><i className="sila-icon sila-icon-refresh text-primary mr-2"></i><span className="lnk text-lg">Refresh</span></Button>
        </OverlayTrigger>}
      </div>

      <div className="status form-control d-flex mb-4">
        <span className={`user ${!activeUser ? 'text-meta' : 'text-primary'}`}>{activeUser ? (activeUser.entity_name || `${activeUser.firstName} ${activeUser.lastName} (${activeUser.handle})`) : app.settings.flow === 'kyb' ? 'Business Members' : 'User'}</span>
        <em className={`message ml-auto${app[app.settings.flow].alert ? ` text-${app[app.settings.flow].alert.type === 'wait' ? 'primary' : app[app.settings.flow].alert.type}` : ''}`}>{app[app.settings.flow].alert ? app[app.settings.flow].alert.message : 'Status'}</em>
      </div>

      {app.alert.message && <div className="mb-4"><AlertMessage message={app.alert.message} type={app.alert.type} /></div>}

      {app.settings.flow === 'kyb' && <>
        <h2 className="mt-5 mb-3">KYC Review Status</h2>
        {app[app.settings.flow].members ? app[app.settings.flow].members.map((member, index) =>
          <div key={index} className="status form-control d-flex mb-4 loaded">
            <span className="user"><span className="text-primary">{`${member.first_name} ${member.last_name} (${member.user_handle})`}</span> <span className="mx-2">&ndash;</span> <em>{app.settings.kybRoles.find(role => role.name === member.role).label}</em></span>
            {member.verification_status.includes('passed') ? 
            <em className="message ml-auto text-success">Passed ID verification</em> : 
            member.verification_status.includes('pending') ? 
            <em className="message ml-auto text-warning">Pending ID verification</em> : 
            member.verification_status.includes('unverified') ? 
            <em className="message ml-auto text-warning">Unverified ID verification</em> : 
            member.verification_status.includes('failed') ?
            <em className="message ml-auto text-danger">Failed ID verification</em> : null}
          </div>
        ) :
          <div className="status form-control d-flex mb-4">
            <span className="user text-meta">Business Members</span>
            <em className="message ml-auto">Status</em>
          </div>}
      </>}

      <Pagination
        previous={previous}
        next={isActive ? next : undefined}
        currentPage={page} />

    </Container>
  );
};

export default RequestKYC;
