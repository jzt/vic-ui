/*
 Copyright 2017 VMware, Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

import { VicWebappPage } from './app.po';
import { browser, by, element } from 'protractor';

describe('vic-webapp', () => {
  let page: VicWebappPage;
  let specRunId: number;
  const defaultTimeout = 5000;
  const sectionSummary = 'section#summary';
  const sectionOpsUser = 'section#ops-user';
  const sectionSecurity = 'section#security';
  const sectionNetworks = 'section#networks';
  const sectionStorage = 'section#storage-capacity';
  const sectionCompute = 'section#compute-capacity';
  const modalWizard = '.clr-wizard-stepnav';
  const dataGridCell = '.datagrid-cell';
  const iframeTabs = 'div.outer-tab-content iframe.sandbox-iframe';
  const namePrefix = 'virtual-container-host-';

  beforeAll(() => {
    specRunId = Math.floor(Math.random() * 1000) + 100;
  });

  beforeEach(() => {
    page = new VicWebappPage();
  });

  it('should redirect to login', () => {
    page.navigateTo();
    expect(browser.getCurrentUrl()).toContain('SSO');
  });

  it('should login', () => {
    page.login();
    browser.sleep(10000);
    browser.waitForAngularEnabled(true);
    expect(browser.getCurrentUrl()).toContain('/ui');
  });

  it('should navigate to vsphere home', () => {
    page.navigateToHome();
    expect(browser.getCurrentUrl()).toContain('vsphere');
  });

  it('should navigate to vic plugin', () => {
    page.navigateToVicPlugin();
    expect(browser.getCurrentUrl()).toContain('vic');
  });

  it('should navigate to summary tab', () => {
    page.navigateToSummaryTab();
    expect(browser.getCurrentUrl()).toContain('vic-root');
  });

  it('should navigate to vch tab', () => {
    page.navigateToVchTab();
    expect(browser.getCurrentUrl()).toContain('customtab-vch');
  });

  it('should open create vch wizard', () => {
    page.openVchWizard();
    page.waitForElementToBePresent(modalWizard);
    expect(element(by.css(modalWizard)).isPresent()).toBe(true);
  });

  it('should input vch name', () => {
    browser.driver.findElement(by.css('#nameInput')).sendKeys('-' + specRunId);
  });

  it('should complete general step', () => {
    page.clickButton('Next');
    // check if we made it to compute capacity section
    page.waitForElementToBePresent(sectionCompute);
    expect(element(by.css(sectionCompute)).isPresent()).toBe(true);
  });

  it('should select a compute resource', () => {
    page.selectComputeResource();
  });

  it('should complete compute capacity step', () => {
    page.clickButton('Next');
    // check if we made it to storage capacity section
    page.waitForElementToBePresent(sectionStorage);
    expect(element(by.css(sectionStorage)).isPresent()).toBe(true);
  });

  it('should select a datastore', () => {
    page.selectDatastore();
  });

  it('should complete storage capacity step', () => {
    page.clickButton('Next');
    // check if we made it to networks section
    page.waitForElementToBePresent(sectionNetworks);
    expect(element(by.css(sectionNetworks)).isPresent()).toBe(true);
  });

  it('should select a bridge network', () => {
    page.selectBridgeNetwork();
  });

  it('should select a public network', () => {
    page.selectPublicNetwork();
  });

  it('should complete networks step', () => {
    page.clickButton('Next');
    // check if we made it to security section
    page.waitForElementToBePresent(sectionSecurity);
    expect(element(by.css(sectionSecurity)).isPresent()).toBe(true);
  });

  /*it('should disable secure access', () => {
    page.disableSecureAccess();
  });*/

  it('should complete security step', () => {
    page.clickButton('Next');
    // check if we made it to ops user section
    page.waitForElementToBePresent(sectionOpsUser);
    expect(element(by.css(sectionOpsUser)).isPresent()).toBe(true);
  });

  it('should enter ops user creds', () => {
    page.enterOpsUserCreds();
  });

  it('should complete ops user step', () => {
    page.clickButton('Next');
    // check if we made it to summary section
    page.waitForElementToBePresent(sectionSummary);
    expect(element(by.css(sectionSummary)).isPresent()).toBe(true);
  });

  it('should create a vch', () => {
    page.createVch();
  });

  it('should find the new vch in datagrid', () => {
    let vchFound = false;
    page.waitForElementToBePresent(dataGridCell);
    page.clickByCSS('.pagination-next');
    page.waitForElementToBePresent(dataGridCell);
    browser.sleep(defaultTimeout);
    const newVch = new RegExp(namePrefix + specRunId);
    element.all(by.css(dataGridCell)).each(function(element, index) {
      element.getText().then(function(text) {
        if (newVch.test(text)) {
          vchFound = true;
        }
      });
    }).then(function() {
      expect(vchFound).toBeTruthy();
    });
  });

  it('should delete created vch', () => {
    page.deleteVch(namePrefix + specRunId);
  });


  it('should verify the created vch has been deleted', () => {
    browser.ignoreSynchronization = true;
    let vchFound = false;
    browser.switchTo().defaultContent();
    browser.switchTo().frame(browser.driver.findElement(by.css(iframeTabs)));
    browser.sleep(defaultTimeout);
    page.waitForElementToBePresent(dataGridCell);
    browser.sleep(defaultTimeout);
    const deletedVch = new RegExp(namePrefix + specRunId);
    element.all(by.css(dataGridCell)).each(function(element, index) {
      element.getText().then(function(text) {
        if (deletedVch.test(text)) {
          vchFound = true;
        }
      });
    });
    browser.sleep(defaultTimeout);
    expect(vchFound).toBeFalsy();
  });

});
