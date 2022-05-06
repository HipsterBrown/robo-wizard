import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  image?: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Framework & Form Agnostic',
    Svg: require('@site/static/img/form-icon.svg').default,
    description: (
      <>
        Bring your own UI and form manager, even if it's just plain old HTML!
      </>
    ),
  },
  {
    title: 'Powered by XState FSM',
    image: require('@site/static/img/xstate-fsm-logo.png').default,
    description: (
      <>
        While the underlying implementation could be anything, the flexibility and maturity of the
        XState ecosystem provides stellar support for Robo Wizard.
      </>
    ),
  },
];

function Feature({ title, Svg, description, image }: FeatureItem) {
  return (
    <div>
      <div className="text--center">
        {Svg && <Svg className={styles.featureSvg} role="img" />}
        {image && <img src={image} />}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.grid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
