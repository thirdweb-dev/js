import styles from "./List.module.css";

export function UnorderedList(props: { children?: React.ReactNode }) {
	return <ul className={styles.unorderedList}>{props.children}</ul>;
}

export function OrderedList(props: { children?: React.ReactNode }) {
	return <ul className={styles.orderedList}>{props.children}</ul>;
}
