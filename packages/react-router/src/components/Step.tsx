import { Route, RouteProps } from 'react-router'
import type { StepConfig } from 'robo-wizard'

/**
 * @param props - accept same props as the [Route component from react-router](https://reactrouter.com/docs/en/v6/api#routes-and-route), excepte for `path`, as well as [[StepConfig]] from `robo-wizard`
 **/
export function Step({ name, ...routeProps }: Exclude<RouteProps, 'path'> & StepConfig) {
  return <Route path={name} {...routeProps} />;
}
