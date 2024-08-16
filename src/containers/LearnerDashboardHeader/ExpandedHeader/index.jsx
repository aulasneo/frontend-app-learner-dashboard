import React, { useEffect, useState } from 'react';
import { getConfig, camelCaseObject } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import urls from 'data/services/lms/urls';
import { reduxHooks } from 'hooks';
import AuthenticatedUserDropdown from './AuthenticatedUserDropdown';
import { useIsCollapsed, findCoursesNavClicked } from '../hooks';
import messages from '../messages';
import BrandLogo from '../BrandLogo';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export const ExpandedHeader = () => {
  const { formatMessage } = useIntl();
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();
  const isCollapsed = useIsCollapsed();
  const [linkPanorama, setLinkPanorama] = useState(null);

  const exploreCoursesClick = findCoursesNavClicked(
    urls.baseAppUrl(courseSearchUrl),
  );

  useEffect(() => {
    const fetchLink = async () => {
      const url = `${getConfig().LMS_BASE_URL}/panorama/api/get-user-access`;
      try {
        const { data } = await getAuthenticatedHttpClient().get(url);
        const linkData = camelCaseObject(data);
        const linkResponse = linkData.body;
        setLinkPanorama(linkResponse);
      } catch (error) {
        const httpErrorStatus = error?.response?.status;
        console.error('Error fetching panorama link:', httpErrorStatus);
      }
    };
    fetchLink();
  }, []);

  if (isCollapsed) {
    return null;
  }

  return (
    <header className="d-flex shadow-sm align-items-center learner-variant-header pl-4">
      <div className="flex-grow-1 d-flex align-items-center">
        <BrandLogo />

        <Button
          as="a"
          href="/"
          variant="inverse-primary"
          className="p-4 course-link"
        >
          {formatMessage(messages.course)}
        </Button>
        <Button
          as="a"
          href={urls.programsUrl()}
          variant="inverse-primary"
          className="p-4"
        >
          {formatMessage(messages.program)}
        </Button>
        <Button
          as="a"
          href={urls.baseAppUrl(courseSearchUrl)}
          variant="inverse-primary"
          className="p-4"
          onClick={exploreCoursesClick}
        >
          {formatMessage(messages.discoverNew)}
        </Button>
        {linkPanorama && (
          <Button
            as="a"
            href={getConfig().PANORAMA_URL}
            variant="inverse-primary"
            className="p-4"
          >
            Panorama
          </Button>
        )}
        <span className="flex-grow-1" />
        <Button
          as="a"
          href={getConfig().SUPPORT_URL}
          variant="inverse-primary"
          className="p-4"
        >
          {formatMessage(messages.help)}
        </Button>
      </div>

      <AuthenticatedUserDropdown />
    </header>
  );
};

export default ExpandedHeader;
