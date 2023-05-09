import React, { Fragment, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./mail.scss";
import {
  Button,
  Card,
  Nav,
  NavLink,
  NavItem,
} from "reactstrap";

import cx from "classnames";

import PageTitle from "../../../Layout/AppMain/PageTitle";
import MailList from "./MailList";
import FolderList from "./FolderList";

const Mailbox = () => {
  const [state, setState] = useState({
    active: false,
  });

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" classNames="TabsAnimation" appear={true} timeout={1500} enter={false} exit={false}>
          <div>
            <div
              className={cx("app-inner-layout TabsAnimation", {
                "open-mobile-menu": state.active,
              })}
            >
              <div className="app-inner-layout__header bg-heavy-rain">
                <PageTitle
                  heading="Mailbox Layout Example"
                  subheading="Create stunning UIs for your pages with these layout components."
                  icon="pe-7s-power icon-gradient bg-mixed-hopes"
                />
              </div>
              <div className="app-inner-layout__wrapper">
                <MailList />
                <FolderList />
                {/* <Card className="app-inner-layout__sidebar">
                  <Nav vertical>
                    <NavItem className="pt-4 ps-3 pe-3 pb-3">
                      <Button block color="primary" className="btn-pill btn-shadow">
                        Write New Email
                      </Button>
                    </NavItem>
                    <NavItem className="nav-item-header">My Account</NavItem>
                    <NavItem>
                      <NavLink href="#">
                        <i className="nav-link-icon pe-7s-chat"> </i>
                        <span>Inbox</span>
                        <div className="ms-auto badge rounded-pill bg-info">8</div>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="#">
                        <i className="nav-link-icon pe-7s-wallet"> </i>
                        <span>Sent Items</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="#">
                        <i className="nav-link-icon pe-7s-config"> </i>
                        <span>All Messages</span>
                        <div className="ms-auto badge bg-success">New</div>
                      </NavLink>
                    </NavItem>
                    <NavItem className="nav-item-divider" />
                    <NavItem>
                      <NavLink href="#">
                        <i className="nav-link-icon pe-7s-box2"> </i>
                        <span>Trash</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="#">
                        <i className="nav-link-icon pe-7s-coffee"> </i>
                        <span>Others</span>
                        <div className="ms-auto badge bg-warning">512</div>
                      </NavLink>
                    </NavItem>
                    <NavItem className="nav-item-divider" />
                  </Nav>
                </Card> */}
              </div>
            </div>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </Fragment>
  );
};

export default Mailbox;
